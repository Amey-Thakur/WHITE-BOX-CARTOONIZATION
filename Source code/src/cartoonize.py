"""
cartoonize.py
=============================================================================
This script allows you to run the cartoonization model on a folder of images.
Usage:
    python cartoonize.py
    
    It will:
    1. Look for images in 'test_images'
    2. Process them using the saved model in 'saved_models'
    3. Save the results in 'cartoonized_images'
=============================================================================
"""
import os
import cv2
import numpy as np
import tensorflow as tf 
import network
import guided_filter
from tqdm import tqdm

try:
    # TensorFlow 2.x compatibility: Disable eager execution to use legacy graph mode
    tf.compat.v1.disable_eager_execution()
except Exception:
    pass


def resize_crop(image):
    """
    Resizes image to be compatible with the model (dimensions multiple of 8).
    Also limits max dimension to 720px for performance.
    """
    h, w, c = np.shape(image)
    if min(h, w) > 720:
        if h > w:
            h, w = int(720*h/w), 720
        else:
            h, w = 720, int(720*w/h)
    image = cv2.resize(image, (w, h),
                       interpolation=cv2.INTER_AREA)
    h, w = (h//8)*8, (w//8)*8
    image = image[:h, :w, :]
    return image
    

def cartoonize(load_folder, save_folder, model_path):
    """
    Main function to process images in a folder.
    """
    # Define Input Placeholder
    input_photo = tf.compat.v1.placeholder(tf.float32, [1, None, None, 3])
    
    # Build Network Graph
    network_out = network.unet_generator(input_photo)
    final_out = guided_filter.guided_filter(input_photo, network_out, r=1, eps=5e-3)

    # Initialize Saver
    all_vars = tf.compat.v1.trainable_variables()
    gene_vars = [var for var in all_vars if 'generator' in var.name]
    saver = tf.compat.v1.train.Saver(var_list=gene_vars)
    
    # Configure Session
    config = tf.compat.v1.ConfigProto()
    config.gpu_options.allow_growth = True
    sess = tf.compat.v1.Session(config=config)

    # Load Weights
    sess.run(tf.compat.v1.global_variables_initializer())
    saver.restore(sess, tf.train.latest_checkpoint(model_path))
    
    # Process Images
    name_list = os.listdir(load_folder)
    for name in tqdm(name_list):
        try:
            load_path = os.path.join(load_folder, name)
            save_path = os.path.join(save_folder, name)
            
            image = cv2.imread(load_path)
            image = resize_crop(image)
            
            # Normalize and Batch
            batch_image = image.astype(np.float32)/127.5 - 1
            batch_image = np.expand_dims(batch_image, axis=0)
            
            # Run Inference
            output = sess.run(final_out, feed_dict={input_photo: batch_image})
            
            # Post-process
            output = (np.squeeze(output)+1)*127.5
            output = np.clip(output, 0, 255).astype(np.uint8)
            
            # Save
            cv2.imwrite(save_path, output)
        except Exception as e:
            print('cartoonize {} failed'.format(load_path))
            print(e)


if __name__ == '__main__':
    model_path = 'saved_models'
    load_folder = 'test_images'
    save_folder = 'cartoonized_images'
    
    if not os.path.exists(save_folder):
        os.mkdir(save_folder)
        
    cartoonize(load_folder, save_folder, model_path)
