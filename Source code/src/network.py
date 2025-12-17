"""
network.py
=============================================================================
This file defines the Neural Network architecture used for cartoonization.
It uses a "U-Net" based Generator with Residual Blocks.

Key Components:
1.  Convolutional Layers: To extract features (edges, textures) from the image.
2.  Leaky ReLU: Activation function to introduce non-linearity.
3.  Residual Blocks (ResBlock): To help the network learn complex transformations without losing original details.
4.  U-Net Structure: Downsamples the image to understand global context, then upsamples it back to original size.
=============================================================================
"""
import tensorflow as tf
import numpy as np
try:
    import tf_slim as slim
except ImportError:
    try:
        import tensorflow.contrib.slim as slim
    except ImportError:
        print("Error: Could not import slim. Please install tf-slim.")


def resblock(inputs, out_channel=32, name='resblock'):
    """
    Defines a Residual Block.
    Input -> [Conv -> ReLU -> Conv] + Input -> Output
    This "skip connection" (+ Input) prevents the gradient from vanishing
    and allows the network to learn "residuals" (changes) rather than constructing from scratch.
    """
    with tf.compat.v1.variable_scope(name):
        
        # First Convolution
        x = slim.convolution2d(inputs, out_channel, [3, 3], 
                               activation_fn=None, scope='conv1')
        x = tf.nn.leaky_relu(x)
        
        # Second Convolution
        x = slim.convolution2d(x, out_channel, [3, 3], 
                               activation_fn=None, scope='conv2')
        
        # Add the original input back to the result (Skip Connection)
        return x + inputs


def unet_generator(inputs, channel=32, num_blocks=4, name='generator', reuse=False):
    """
    Defines the Generator Network.
    Structure: Encoder -> Bottleneck (ResBlocks) -> Decoder
    """
    with tf.compat.v1.variable_scope(name, reuse=reuse):
        
        # --- ENCODER (Downsampling) ---
        # Reduce the spatial size (Height/Width) but increase the depth (Channels)
        
        # Initial Convolution (7x7 kernel to capture large features)
        x0 = slim.convolution2d(inputs, channel, [7, 7], activation_fn=None)
        x0 = tf.nn.leaky_relu(x0)
        
        # Downsample 1
        x1 = slim.convolution2d(x0, channel, [3, 3], stride=2, activation_fn=None)
        x1 = tf.nn.leaky_relu(x1)
        x1 = slim.convolution2d(x1, channel*2, [3, 3], activation_fn=None)
        x1 = tf.nn.leaky_relu(x1)
        
        # Downsample 2
        x2 = slim.convolution2d(x1, channel*2, [3, 3], stride=2, activation_fn=None)
        x2 = tf.nn.leaky_relu(x2)
        x2 = slim.convolution2d(x2, channel*4, [3, 3], activation_fn=None)
        x2 = tf.nn.leaky_relu(x2)
        
        # --- BOTTLENECK (Processing) ---
        # Apply multiple Residual Blocks to process the image features (the "Cartoonizing" logic)
        for idx in range(num_blocks):
            x2 = resblock(x2, out_channel=channel*4, name='block_{}'.format(idx))
            
        # --- DECODER (Upsampling) ---
        # Increase spatial size back to original resolution
        
        x2 = slim.convolution2d(x2, channel*2, [3, 3], activation_fn=None)
        x2 = tf.nn.leaky_relu(x2)
        
        # Upsample 1
        h1, w1 = tf.shape(x2)[1], tf.shape(x2)[2]
        x3 = tf.compat.v1.image.resize_bilinear(x2, (h1*2, w1*2)) # Double the size
        x3 = slim.convolution2d(x3+x1, channel*2, [3, 3], activation_fn=None) # +x1 is a Skip Connection from Encoder
        x3 = tf.nn.leaky_relu(x3)
        x3 = slim.convolution2d(x3, channel, [3, 3], activation_fn=None)
        x3 = tf.nn.leaky_relu(x3)

        # Upsample 2
        h2, w2 = tf.shape(x3)[1], tf.shape(x3)[2]
        x4 = tf.compat.v1.image.resize_bilinear(x3, (h2*2, w2*2)) # Double the size again
        x4 = slim.convolution2d(x4+x0, channel, [3, 3], activation_fn=None) # +x0 is a Skip Connection from Input
        x4 = tf.nn.leaky_relu(x4)
        
        # Final Convolution to produce RGB image (3 channels)
        x4 = slim.convolution2d(x4, 3, [7, 7], activation_fn=None)
        
        return x4

if __name__ == '__main__':
    pass
