# Research and Training Sandbox

This directory contains experimental implementations, Jupyter notebooks, and browser-side deployments of the White-Box Cartoonization project.

**Main Implementation**: [../Mini-Project/](../Mini-Project/)

## Directory Structure

```
Research-and-Training/
│
├── Experimental-Implementations/      # Alternative approaches
│   ├── White_box_Cartoonization.ipynb # Jupyter notebook experiments
│   ├── model.js                       # Browser implementation
│   ├── web/                           # TensorFlow.js (standard)
│   ├── web-float16/                   # TensorFlow.js (FP16)
│   └── web-uint8/                     # TensorFlow.js (quantized)
│
└── README.md                          # This file
```

## Usage

The files in this directory are primarily for:

1. **Experimental Reference** - Understanding alternative deployment methods
2. **Notebook Exploration** - Interactive research and visualization
3. **Web Deployment** - Browser-based inference tests

For the core training implementation and academic reports, see the [Mini-Project/](../Mini-Project/) directory in the root.

## Technical Context

The experimental implementations within this sandbox explore the performance trade-offs of different quantization methods (Float16 vs UInt8) and browser-based inference using TensorFlow.js.

## Related Documentation

- **Main README**: [../README.md](../README.md) - Complete project overview
- **Mini-Project Implementation**: [../Mini-Project/](../Mini-Project/) - Training resources
- **Production App**: [../Source code/](../Source%20code/) - Flask application

