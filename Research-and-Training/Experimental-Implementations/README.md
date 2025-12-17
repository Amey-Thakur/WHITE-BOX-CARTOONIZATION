# Experimental Implementations

This directory contains alternative implementation approaches and experimental code developed during the research phase of the White-Box Cartoonization project.

## Directory Structure

```
Experimental-Implementations/
│
├── White_box_Cartoonization.ipynb    # Jupyter notebook
│   └── Training and testing experiments
│
├── model.js                           # TensorFlow.js loader
│   └── Browser-based implementation
│
├── web/                               # Standard precision model
│   ├── model.json                     # Model architecture
│   ├── group1-shard1of2.bin          # Model weights (part 1)
│   └── group1-shard2of2.bin          # Model weights (part 2)
│
├── web-float16/                       # Half precision model
│   ├── model.json                     # Model architecture
│   └── group1-shard1of1.bin          # Model weights
│
├── web-uint8/                         # Quantized model
│   ├── model.json                     # Model architecture
│   └── group1-shard1of1.bin          # Model weights
│
└── README.md                          # This file
```

## Overview

This directory contains two alternative implementation approaches explored during development:

1. **Jupyter Notebook** - Initial experimentation and training code
2. **TensorFlow.js Models** - Browser-based implementation (no server required)

## Usage

### Jupyter Notebook
```bash
jupyter notebook White_box_Cartoonization.ipynb
```

### TensorFlow.js Models
Originally developed for static GitHub Pages deployment where cartoonization runs entirely client-side without a Python server.

## Note

These files are maintained for historical reference. The current production application uses the Flask-based implementation with TensorFlow Python backend for better performance.

**Production App**: [../../Source code/](../../Source%20code/)
