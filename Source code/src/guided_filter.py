"""
guided_filter.py
=============================================================================
This file implements the "Guided Filter" technique.
In the context of this project, it is used to refine the output of the Neural Network.
The Neural Network might produce noisy or slightly blurry edges. The Guided Filter
uses the original high-resolution image to "guide" the smoothing process, ensuring
clean, sharp edges in the final cartoon.
=============================================================================
"""
import tensorflow as tf
import numpy as np

def tf_box_filter(x, r):
    """
    Implements a Box Filter using mean convolution.
    A box filter essentially calculates the average value of pixels in a square window.
    """
    k_size = int(2*r+1)
    ch = x.get_shape().as_list()[-1]
    weight = 1/(k_size**2)
    box_kernel = weight*np.ones((k_size, k_size, ch, 1))
    box_kernel = np.array(box_kernel).astype(np.float32)
    output = tf.nn.depthwise_conv2d(x, box_kernel, [1, 1, 1, 1], 'SAME')
    return output


def guided_filter(x, y, r, eps=1e-2):
    """
    Apply Guided Filter.
    :param x: The guidance image (usually the original input photo)
    :param y: The filtering input image (the raw output from the generator)
    :param r: Radius of the filter
    :param eps: Epsilon (regularization parameter)
    :return: The filtered image (sharper edges, smoother flat areas)
    """
    
    x_shape = tf.shape(x)

    # N is the number of pixels in each window
    N = tf_box_filter(tf.ones((1, x_shape[1], x_shape[2], 1), dtype=x.dtype), r)

    # Calculate means (averages)
    mean_x = tf_box_filter(x, r) / N
    mean_y = tf_box_filter(y, r) / N
    cov_xy = tf_box_filter(x * y, r) / N - mean_x * mean_y
    var_x  = tf_box_filter(x * x, r) / N - mean_x * mean_x

    # Calculate linear coefficients (A, b)
    A = cov_xy / (var_x + eps)
    b = mean_y - A * mean_x

    # Calculate mean of coefficients
    mean_A = tf_box_filter(A, r) / N
    mean_b = tf_box_filter(b, r) / N

    # The final output is a linear combination of the guidance image and the coefficients
    output = mean_A * x + mean_b

    return output


def fast_guided_filter(lr_x, lr_y, hr_x, r=1, eps=1e-8):
    """
    Fast version of Guided Filter (works on low-res images then upsamples).
    Not used in the main pipeline but kept for reference.
    """
    lr_x_shape = tf.shape(lr_x)
    hr_x_shape = tf.shape(hr_x)
    
    N = tf_box_filter(tf.ones((1, lr_x_shape[1], lr_x_shape[2], 1), dtype=lr_x.dtype), r)

    mean_x = tf_box_filter(lr_x, r) / N
    mean_y = tf_box_filter(lr_y, r) / N
    cov_xy = tf_box_filter(lr_x * lr_y, r) / N - mean_x * mean_y
    var_x  = tf_box_filter(lr_x * lr_x, r) / N - mean_x * mean_x

    A = cov_xy / (var_x + eps)
    b = mean_y - A * mean_x

    mean_A = tf.image.resize_images(A, hr_x_shape[1: 3])
    mean_b = tf.image.resize_images(b, hr_x_shape[1: 3])

    output = mean_A * hr_x + mean_b
    
    return output

if __name__ == '__main__':
    pass
