# Source Code - Web Application

This directory contains the complete implementation of the White-Box Cartoonization web application, including the Flask backend, AI model integration, and responsive frontend interface.

## Overview

The application provides a user-friendly web interface for transforming photographs into cartoon-style images using a pre-trained deep learning model. The implementation follows a modular architecture separating concerns between the web server, AI inference pipeline, and client interface.

**Live Demo**: [https://amey-thakur.github.io/WHITE-BOX-CARTOONIZATION](https://amey-thakur.github.io/WHITE-BOX-CARTOONIZATION)

---

## Directory Structure

```
Source code/
│
├── app.py                     # Flask application server
├── backend.py                 # AI model wrapper and image processing
├── index.html                 # Web interface
│
├── static/                    # Frontend assets
│   ├── css/                   # Stylesheets
│   │   ├── style.css          # Main application styles
│   │   ├── mobile.css         # Responsive mobile styles
│   │   └── theme.css          # Color schemes and theming
│   │
│   ├── js/                    # JavaScript modules
│   │   └── main.js            # Client-side application logic
│   │
│   └── images/                # UI assets
│       ├── Clapper.png        # Application icon (raster)
│       └── Clapper.svg        # Application icon (vector)
│
└── src/                       # Core AI implementation
    ├── network.py             # U-Net generator architecture
    ├── guided_filter.py       # Edge-preserving filter
    ├── cartoonize.py          # Standalone cartoonization script
    └── saved_models/          # Pre-trained model checkpoint
        ├── checkpoint         # TensorFlow checkpoint metadata
        ├── saved_models.data  # Model weights
        └── saved_models.index # Model variable index
```

---

## Component Descriptions

### Backend Components

#### `app.py` - Flask Application Server

**Purpose**: Main entry point for the web application

**Functionality**:
- Initializes Flask web server with static file serving
- Defines HTTP routes for page serving and image processing
- Loads AI model once at startup for efficiency
- Handles file uploads and returns cartoonized results
- Configured for development with debug mode and hot-reload

**Key Routes**:
- `GET /` - Serves the web interface
- `POST /cartoonize` - Processes uploaded images

**Configuration**:
- Host: `0.0.0.0` (accessible on all network interfaces)
- Port: `5002`
- Debug: Enabled for development

#### `backend.py` - AI Model Interface

**Purpose**: Encapsulates TensorFlow model interaction and image preprocessing

**Key Classes**:
- `Cartoonizer` - Main interface for cartoonization

**Methods**:
- `__init__(model_path)` - Initializes and loads the model
- `_load_model()` - Configures TensorFlow session and restores weights
- `resize_crop(image)` - Preprocesses images to compatible dimensions
- `predict(image_bytes)` - Performs end-to-end cartoonization

**Processing Pipeline**:
1. Decode image bytes to NumPy array
2. Resize to maximum 720px while maintaining aspect ratio
3. Crop to dimensions divisible by 8
4. Normalize pixel values to [-1, 1] range
5. Execute neural network inference
6. Apply guided filter for edge refinement
7. Denormalize and encode result as JPEG

#### `src/network.py` - Neural Network Architecture

**Purpose**: Defines the U-Net generator architecture

**Key Components**:
- Encoder blocks with downsampling
- Bottleneck layer for feature compression
- Decoder blocks with upsampling
- Skip connections for spatial information preservation

**Architecture**: U-Net based encoder-decoder network optimized for image-to-image translation

#### `src/guided_filter.py` - Edge Refinement

**Purpose**: Implements guided filtering for cartoon-like edge enhancement

**Algorithm**: Edge-preserving smoothing filter that refines the neural network output to achieve characteristic cartoon aesthetics

**Parameters**:
- `r` (radius): Local window size for filtering
- `eps` (epsilon): Regularization parameter

#### `src/cartoonize.py` - Standalone Script

**Purpose**: Command-line interface for batch image processing

**Usage**: Can be used independently for processing images without the web interface

### Frontend Components

#### `index.html` - Web Interface

**Purpose**: Responsive single-page application for image upload and result visualization

**Features**:
- Drag-and-drop image upload
- File picker fallback
- Real-time preview of uploaded images
- Loading state during processing
- Result display with download capability
- Responsive design for mobile and desktop

**Technologies**:
- HTML5 semantic elements
- CSS3 Grid and Flexbox layouts
- Vanilla JavaScript (no frameworks)
- Fetch API for asynchronous requests

#### `static/css/style.css` - Main Stylesheet

**Purpose**: Core application styling

**Includes**:
- Layout definitions
- Component styling
- Animation keyframes
- Color schemes
- Typography

#### `static/css/mobile.css` - Responsive Styles

**Purpose**: Media queries and mobile-specific optimizations

**Breakpoints**:
- Tablet: ≤768px
- Mobile: ≤480px

#### `static/css/theme.css` - Theming

**Purpose**: Color palette and theme variables

**Defines**:
- CSS custom properties (variables)
- Primary and accent colors
- Dark/light mode support (if applicable)

#### `static/js/main.js` - Client Logic

**Purpose**: Handles user interactions and server communication

**Functionality**:
- File upload handling
- Image preview rendering
- AJAX requests to backend
- Error handling and user feedback
- Result display and download management

---

## Quick Start

### Prerequisites

Ensure you have Python 3.8+ installed with required dependencies:

```bash
pip install flask flask-cors tensorflow opencv-python numpy tf-slim
```

### Running the Application

1. Navigate to this directory:
```bash
cd "Source code"
```

2. Start the Flask server:
```bash
python app.py
```

3. Access the application:
```
http://localhost:5002
```

### Development Mode

The application runs in debug mode by default, providing:
- Automatic server restart on code changes
- Detailed error messages
- Request logging

**Note**: Disable debug mode for production deployment by setting `debug=False` in `app.py`

---

## API Documentation

### POST /cartoonize

**Description**: Processes an uploaded image and returns the cartoonized version

**Request**:
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with `file` field containing image

**Response**:
- Content-Type: `image/jpeg`
- Body: Binary JPEG image data

**Example using cURL**:
```bash
curl -X POST -F "file=@input.jpg" http://localhost:5002/cartoonize --output result.jpg
```

**Example using Python**:
```python
import requests

with open('input.jpg', 'rb') as f:
    response = requests.post('http://localhost:5002/cartoonize', files={'file': f})

with open('output.jpg', 'wb') as f:
    f.write(response.content)
```

---

## Configuration

### Modifying Server Settings

Edit `app.py` to customize server configuration:

```python
# Change port
app.run(host='0.0.0.0', debug=True, port=5003)

# Disable debug mode for production
app.run(host='0.0.0.0', debug=False, port=5002)

# Bind to localhost only
app.run(host='127.0.0.1', debug=True, port=5002)
```

### Model Path Configuration

The model path is automatically configured relative to the application:

```python
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'src', 'saved_models')
```

To use a different model, modify the `MODEL_PATH` variable in `app.py`

---

## Technical Specifications

### Image Processing Constraints

| Parameter | Value | Reason |
|-----------|-------|--------|
| Maximum Dimension | 720px | Performance optimization |
| Dimension Divisibility | 8 | U-Net architecture requirement |
| Input Format | JPEG, PNG, BMP | OpenCV compatibility |
| Output Format | JPEG | Web-optimized format |
| Color Space | RGB | Model training specification |

### Model Specifications

| Attribute | Value |
|-----------|-------|
| Architecture | U-Net Generator |
| Framework | TensorFlow 1.x (compatibility mode) |
| Precision | FP32 |
| Input Shape | [1, H, W, 3] (variable dimensions) |
| Output Shape | [1, H, W, 3] (matches input) |
| Normalization | [-1, 1] range |

---

## Performance Considerations

### Optimization Strategies

1. **Model Loading**: Model is loaded once at startup, not per request
2. **Image Resizing**: Automatic downscaling of large images
3. **Session Reuse**: TensorFlow session persists across requests
4. **Memory Management**: GPU memory growth enabled for efficient allocation

### Expected Performance

| Image Size | Processing Time (CPU) | Processing Time (GPU) |
|------------|----------------------|----------------------|
| 512×512 | ~2-3 seconds | ~0.5-1 second |
| 1024×1024 | ~5-8 seconds | ~1-2 seconds |
| 1920×1080 | ~8-12 seconds | ~2-3 seconds |

**Note**: Times are approximate and vary based on hardware specifications

---

## Troubleshooting

### Common Issues

**Issue**: Server fails to start due to port conflict

**Solution**: Change the port in `app.py` or terminate the process using port 5002

**Issue**: Model loading takes too long

**Solution**: This is normal on first load; subsequent requests will be fast

**Issue**: Out of memory errors with large images

**Solution**: Images are automatically resized to 720px; reduce this limit in `backend.py` if needed

**Issue**: TensorFlow warnings about oneDNN

**Solution**: These are informational; to suppress, set environment variable `TF_ENABLE_ONEDNN_OPTS=0`

---

## Development Guidelines

### Code Style

- Follow PEP 8 conventions for Python code
- Use meaningful variable names
- Include docstrings for functions and classes
- Comment complex logic

### Adding New Features

1. Backend changes: Modify `app.py` or `backend.py`
2. Frontend changes: Update `index.html` and `static/` files
3. Model changes: Update `src/` modules
4. Test all changes in debug mode before deployment

### Testing

```bash
# Test the server
python app.py

# Test API endpoint
curl -X POST -F "file=@test.jpg" http://localhost:5002/cartoonize --output result.jpg
```

---

## Related Documentation

- **Main README**: [../README.md](../README.md) - Complete project documentation
- **Research Materials**: [../Research-and-Training/README.md](../Research-and-Training/README.md) - Training code and research

---

## License

This source code is part of the White-Box Cartoonization project and is licensed under the MIT License. See [LICENSE](../LICENSE) for details.
