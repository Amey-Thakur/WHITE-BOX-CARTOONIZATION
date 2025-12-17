"""
backend.py
=============================================================================
This module handles the interaction with the TensorFlow Artificial Intelligence model.
It wraps the complex machine learning code into a simple class `Cartoonizer`.

Key Responsibilities:
1.  Load the pre-trained neural network weights.
2.  Pre-process input images (resize, crop).
3.  Run the actual cartoonization inference.
4.  Return the processed image.
=============================================================================
"""
import os
import cv2
import numpy as np
import tensorflow as tf
import sys

# Add the 'src' directory to Python's search path so we can import 'network' and 'guided_filter'
# These are helper files from the original research paper implementation
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src import network
from src import guided_filter

try:
    # "tf_slim" is a library used to define complex neural networks.
    # We rename it to 'slim' because the old code expects that name.
    import tf_slim as slim
except ImportError:
    print("Warning: tf_slim not found. Trying tensorflow.contrib.slim...")

class Cartoonizer:
    def __init__(self, model_path):
        """
        Initialize the Cartoonizer.
        :param model_path: Path to the folder containing the saved model weights.
        """
        self.model_path = model_path
        self.sess = None
        self.input_photo = None
        self.final_out = None
        
        # Load the model immediately when this object is created
        self._load_model()

    def _load_model(self):
        """
        Loads the TensorFlow computation graph and restores the saved weights.
        This setup happens only once to save time.
        """
        # Disable "Eager Execution".
        # TensorFlow 2.x runs code immediately (Eager), but this older model
        # was built for TensorFlow 1.x which builds a "Graph" first.
        try:
            tf.compat.v1.disable_eager_execution()
        except Exception:
            pass

        # 1. Define the Input Placeholder (Where the image goes in)
        # Shape: [Batch_Size, Height, Width, Channels]
        self.input_photo = tf.compat.v1.placeholder(tf.float32, [1, None, None, 3])
        
        # 2. Build the Generator Network (The "Artist")
        # This creates the mathematical structure of the AI
        network_out = network.unet_generator(self.input_photo)
        
        # 3. Apply Guided Filter (The "Polisher")
        # This refines the edges to look more like a cartoon
        self.final_out = guided_filter.guided_filter(self.input_photo, network_out, r=1, eps=5e-3)

        # 4. Create a Saver to load the pre-trained knowledge (weights)
        all_vars = tf.compat.v1.trainable_variables()
        gene_vars = [var for var in all_vars if 'generator' in var.name]
        saver = tf.compat.v1.train.Saver(var_list=gene_vars)
        
        # 5. Start the TensorFlow Session
        config = tf.compat.v1.ConfigProto()
        config.gpu_options.allow_growth = True # Use GPU memory efficiently if available
        self.sess = tf.compat.v1.Session(config=config)

        # 6. Initialize and Restore
        self.sess.run(tf.compat.v1.global_variables_initializer())
        saver.restore(self.sess, tf.train.latest_checkpoint(self.model_path))
        print("Backend: Model loaded successfully!")

    def resize_crop(self, image):
        """
        Resizes and crops the image to be compatible with the model.
        The model works best with dimensions that are multiples of 8.
        """
        h, w, c = np.shape(image)
        # Limit the size to avoid running out of memory on large images
        if min(h, w) > 720:
            if h > w:
                h, w = int(720*h/w), 720
            else:
                h, w = 720, int(720*w/h)
        image = cv2.resize(image, (w, h), interpolation=cv2.INTER_AREA)
        
        # Ensure dimensions are divisible by 8
        h, w = (h//8)*8, (w//8)*8
        image = image[:h, :w, :]
        return image

    def predict(self, image_bytes):
        """
        The main public method.
        :param image_bytes: Raw bytes of the uploaded image file.
        :return: Raw bytes of the cartoonized JPEG image.
        """
        # 1. Decode bytes -> Image Matrix (Height, Width, Colors)
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            print("ERROR: Failed to decode image!")
            return b''

        # 2. Pre-process (Resize/Crop)
        image = self.resize_crop(image)
        
        # 3. Normalize pixel values from [0, 255] to [-1, 1] for the AI
        batch_image = image.astype(np.float32)/127.5 - 1
        # Add batch dimension: [H, W, 3] -> [1, H, W, 3]
        batch_image = np.expand_dims(batch_image, axis=0)
        
        # 4. Run the AI!
        # feed_dict inputs the image into the placeholder we defined earlier
        output = self.sess.run(self.final_out, feed_dict={self.input_photo: batch_image})
        
        # 5. Post-process: [-1, 1] -> [0, 255]
        output = (np.squeeze(output)+1)*127.5
        output = np.clip(output, 0, 255).astype(np.uint8)
        print(f"DEBUG: Final output shape: {output.shape}")
        
        # 6. Encode Image Matrix -> JPEG bytes
        _, buffer = cv2.imencode('.jpg', output)
        return buffer.tobytes()
