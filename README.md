<div align="center">

  [![Authors](https://img.shields.io/badge/Authors-Amey%20Thakur%20%26%20Mega%20Satish-blue.svg)](#authors)
  [![Project Version](https://img.shields.io/badge/Version-1.0.0-green.svg)](https://github.com/Amey-Thakur/WHITE-BOX-CARTOONIZATION)
  [![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
  [![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?style=flat&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)
  [![Flask](https://img.shields.io/badge/Flask-3.1.2-000000?style=flat&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=flat&logo=opensourceinitiative&logoColor=white)](LICENSE)

  # White-Box Cartoonization
  An AI-powered web application that transforms photographs into cartoon-style images using deep learning.

  **[Authors](#authors)** &nbsp;·&nbsp; **[Overview](#overview)** &nbsp;·&nbsp; **[Features](#features)** &nbsp;·&nbsp; **[Structure](#project-structure)** &nbsp;·&nbsp; **[Installation](#installation)** &nbsp;·&nbsp; **[Results](#results-gallery)** &nbsp;·&nbsp; **[License](#license)**

  [![White Box Cartoonization Demo](https://img.youtube.com/vi/8VNc8p6AKmw/0.jpg)](https://youtu.be/8VNc8p6AKmw)
  
  *Research implementation of White-Box Cartoonization using an Extended GAN Framework.*

</div>

---

## Overview

This project implements a white-box cartoonization model using an extended GAN framework. The application leverages deep learning to transform real-world photographs into cartoon-style images while preserving important visual features and artistic quality.

**Key Components:**
- Flask-based web server with REST API
- TensorFlow deep learning model (U-Net + GAN)
- Responsive web interface with drag-and-drop upload
- Real-time image processing pipeline

---

## Quick Start

```bash
# Clone repository
git clone https://github.com/Amey-Thakur/WHITE-BOX-CARTOONIZATION.git
cd WHITE-BOX-CARTOONIZATION

# Install dependencies
pip install flask flask-cors tensorflow opencv-python numpy tf-slim

# Run application
cd "Source code"
python app.py
```

Access at `http://localhost:5002`

**For detailed setup instructions**, see [Installation Guide](#installation)

---

## Authors

**Terna Engineering College | Computer Engineering | Batch of 2022**

<div align="center">
  <img src="https://github.com/Amey-Thakur.png" width="150px;" alt="Amey Thakur"/><br />
  <sub><b>Amey Thakur</b></sub>
</div>

<div align="center">
  <img src="https://raw.githubusercontent.com/Amey-Thakur/WHITE-BOX-CARTOONIZATION/main/Mega/Mega.png" width="150px;" alt="Mega Satish"/><br />
  <sub><b>Mega Satish</b></sub>
</div>

*Special thanks to **[Mega Satish](https://github.com/msatmod)** for her meaningful contributions, guidance, and support throughout the research and development of this AI implementation.*

---

## Features

| Feature | Description |
|---------|-------------|
| **AI Cartoonization** | Deep learning model trained on cartoon datasets |
| **Real-time Processing** | 2-5 second processing time per image |
| **Web Interface** | Drag-and-drop upload with instant preview |
| **Cross-platform** | Works on desktop and mobile browsers |
| **Open Source** | MIT License - free to use and modify |

---

## Project Structure

```
WHITE-BOX-CARTOONIZATION/
│
├── Source code/                  # Flask application
│   ├── app.py                    # Server entry point
│   ├── backend.py                # AI model interface
│   ├── index.html                # Web UI
│   ├── static/                   # CSS, JS, images
│   └── src/                      # AI implementation
│       ├── network.py            # U-Net architecture
│       ├── guided_filter.py      # Edge refinement
│       └── saved_models/         # Pre-trained weights
│
├── Research-and-Training/        # Research materials
│   ├── Mini-Project/             # Training code
│   ├── Experimental-Implementations/
│   └── Documentation PDFs
│
├── .github/workflows/            # CI/CD pipeline
├── LICENSE                       # MIT License
└── README.md                     # This file
```

**Detailed Documentation:**
- [Source Code README](Source%20code/README.md) - Technical implementation details
- [Research README](Research-and-Training/README.md) - Research materials and training

---

## Installation

### Prerequisites

- Python 3.8 or higher
- 4GB RAM minimum (8GB recommended)
- 500MB storage for dependencies

### Setup Steps

**1. Create Virtual Environment** (recommended)

```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
```

**2. Install Dependencies**

```bash
pip install flask flask-cors tensorflow opencv-python numpy tf-slim
```

**3. Run Application**

```bash
cd "Source code"
python app.py
```

The server will start on `http://localhost:5002`

---

## Usage

### Web Application

1. Open `http://localhost:5002` in your browser
2. Upload an image (drag-and-drop or click to browse)
3. Wait 2-5 seconds for processing
4. Download the cartoonized result

### API Endpoint

```bash
curl -X POST -F "file=@input.jpg" http://localhost:5002/cartoonize --output result.jpg
```

**For API documentation**, see [Source Code README](Source%20code/README.md#api-documentation)

---

## Research & Publications

### Published Paper

**Title:** White-Box Cartoonization Using An Extended GAN Framework

**Authors:** [Amey Thakur](https://github.com/Amey-Thakur), [Hasan Rizvi](https://github.com/rizvihasan), [Mega Satish](https://github.com/msatmod)

**Publications:**
- **IJEAST** Volume 5, Issue 12 - [DOI: 10.33564/IJEAST.2021.v05i12.049](http://dx.doi.org/10.33564/IJEAST.2021.v05i12.049)
- **arXiv** Preprint - [arXiv:2107.04551](https://arxiv.org/abs/2107.04551)
- **ResearchGate** Presentation - [DOI: 10.13140/RG.2.2.22496.40964](http://dx.doi.org/10.13140/RG.2.2.22496.40964)

### Resources

- [Technical Report](https://github.com/Amey-Thakur/WHITE-BOX-CARTOONIZATION/blob/main/Research-and-Training/WHITE-BOX%20CARTOONIZATION%20USING%20AN%20EXTENDED%20GAN%20FRAMEWORK%20REPORT.pdf)
- [Presentation Slides](https://github.com/Amey-Thakur/WHITE-BOX-CARTOONIZATION/blob/main/Research-and-Training/WHITE-BOX%20CARTOONIZATION%20USING%20AN%20EXTENDED%20GAN%20FRAMEWORK%20PRESENTATION.pdf)

### Original Research

This work builds upon: **"Learning to Cartoonize Using White-box Cartoon Representations"** by Xinrui Wang and Jinze Yu (CVPR 2020) - [Paper](https://openaccess.thecvf.com/content_CVPR_2020/html/Wang_Learning_to_Cartoonize_Using_White-Box_Cartoon_Representations_CVPR_2020_paper.html)

---

## Results Gallery

<div align="center">

![Result 1](https://github.com/Amey-Thakur/WHITE-BOX-CARTOONIZATION/assets/54937357/4220a8f7-999e-4077-8ac5-40f97741fdc7)

![Result 2](https://github.com/Amey-Thakur/WHITE-BOX-CARTOONIZATION/assets/54937357/780b6642-8f79-40c6-b433-9a021f86dfb3)

![Result 3](https://github.com/Amey-Thakur/WHITE-BOX-CARTOONIZATION/assets/54937357/00a77151-b78d-4215-8871-7c4c481d3fcb)

![Result 4](https://github.com/Amey-Thakur/WHITE-BOX-CARTOONIZATION/assets/54937357/a5d29de7-a875-43d6-a0c5-43f0695883f8)

![Result 5](https://github.com/Amey-Thakur/WHITE-BOX-CARTOONIZATION/assets/54937357/81f82daa-0130-4af6-be51-867de2b22e7c)

![Result 6](https://github.com/Amey-Thakur/WHITE-BOX-CARTOONIZATION/assets/54937357/4042df79-1011-4a77-980f-820217c8946e)

![Result 7](https://github.com/Amey-Thakur/WHITE-BOX-CARTOONIZATION/assets/54937357/fb76a900-5b29-4930-9f37-b7ca2d7b0df3)

</div>

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -m 'Add improvement'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

**Code Standards:** Follow PEP 8 for Python code and include docstrings for functions.

---

## Citation

If you use this work in academic research, please cite:

```bibtex
@article{thakur2021whitebox,
  title={White-Box Cartoonization Using An Extended GAN Framework},
  author={Thakur, Amey and Rizvi, Hasan and Satish, Mega},
  journal={International Journal of Engineering Applied Sciences and Technology},
  volume={5},
  number={12},
  year={2021},
  doi={10.33564/IJEAST.2021.v05i12.049}
}
```

For arXiv preprint citation, see [full citation details](Research-and-Training/README.md#citation)

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**Copyright © 2021** [Amey Thakur](https://github.com/Amey-Thakur), [Hasan Rizvi](https://github.com/rizvihasan), [Mega Satish](https://github.com/msatmod)

---

## Acknowledgments

Developed as part of the 6th Semester Mini-Project at **Terna Engineering College** (Batch of 2022).

Special thanks to Xinrui Wang and Jinze Yu for their foundational research in white-box cartoon representation learning.

---

<div align="center">

  **[Documentation](Source%20code/README.md)** &nbsp;·&nbsp; **[Research Materials](Research-and-Training/README.md)** &nbsp;·&nbsp; **[Issues](https://github.com/Amey-Thakur/WHITE-BOX-CARTOONIZATION/issues)**

  ---

  🔬 **[Machine Learning Laboratory](https://github.com/Amey-Thakur/MACHINE-LEARNING-LAB)** &nbsp;·&nbsp; 🎨 **[White Box Cartoonization](https://github.com/Amey-Thakur/WHITE-BOX-CARTOONIZATION)**

</div>
