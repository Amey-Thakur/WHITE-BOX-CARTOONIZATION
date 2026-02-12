<div align="center">

  <a name="readme-top"></a>
  # White-Box Cartoonization

  [![License: MIT](https://img.shields.io/badge/License-MIT-lightgrey)](LICENSE)
  ![Status](https://img.shields.io/badge/Status-Completed-success)
  [![Backend](https://img.shields.io/badge/Backend-Python%20%7C%20TensorFlow%20%7C%20Flask-blueviolet)](https://github.com/Amey-Thakur/WHITE-BOX-CARTOONIZATION)
  [![Research](https://img.shields.io/badge/Research-IJEAST%20%7C%20arXiv-orange)](https://arxiv.org/abs/2107.04551)
  [![Developed by Amey Thakur, Hasan Rizvi & Mega Satish](https://img.shields.io/badge/Developed%20by-Amey%20Thakur%2C%20Hasan%20Rizvi%20%26%20Mega%20Satish-blue)](https://github.com/Amey-Thakur/WHITE-BOX-CARTOONIZATION)

  An AI-powered web application that transforms photographs into cartoon-style images using deep learning, utilizing a white-box representation framework and Generative Adversarial Networks (GANs).

  **[Source Code](Source%20Code/)** &nbsp;·&nbsp; **[Research Paper](https://arxiv.org/abs/2107.04551)** &nbsp;·&nbsp; **[Video Demo](https://youtu.be/8VNc8p6AKmw)** &nbsp;·&nbsp; **[Live Demo](https://huggingface.co/spaces/ameythakur/white-box-cartoonization)**

  [![White Box Cartoonization Demo](https://img.youtube.com/vi/8VNc8p6AKmw/0.jpg)](https://youtu.be/8VNc8p6AKmw)

</div>

---

<div align="center">

  [Authors](#authors) &nbsp;·&nbsp; [Overview](#overview) &nbsp;·&nbsp; [Features](#features) &nbsp;·&nbsp; [Structure](#project-structure) &nbsp;·&nbsp; [Results](#results-gallery) &nbsp;·&nbsp; [Quick Start](#quick-start) &nbsp;·&nbsp; [Usage Guidelines](#usage-guidelines) &nbsp;·&nbsp; [License](#license) &nbsp;·&nbsp; [About](#about-this-repository) &nbsp;·&nbsp; [Acknowledgments](#acknowledgments)

</div>

---

<!-- AUTHORS -->
<div align="center">

  ## Authors

  **Terna Engineering College | Computer Engineering | Batch of 2022**

| <a href="https://github.com/Amey-Thakur"><img src="https://github.com/Amey-Thakur.png" width="150" height="150" alt="Amey Thakur"></a><br>[**Amey Thakur**](https://github.com/Amey-Thakur)<br><br>[![ORCID](https://img.shields.io/badge/ORCID-0000--0001--5644--1575-green.svg)](https://orcid.org/0000-0001-5644-1575) | <a href="https://github.com/rizvihasan"><img src="https://github.com/rizvihasan.png" width="150" height="150" alt="Hasan Rizvi"></a><br>[**Hasan Rizvi**](https://github.com/rizvihasan)<br><br>[![GitHub](https://img.shields.io/badge/GitHub-rizvihasan-black?style=flat&logo=github)](https://github.com/rizvihasan) | <a href="https://github.com/msatmod"><img src="https://raw.githubusercontent.com/Amey-Thakur/WHITE-BOX-CARTOONIZATION/main/Mega/Mega.png" width="150" height="150" alt="Mega Satish"></a><br>[**Mega Satish**](https://github.com/msatmod)<br><br>[![ORCID](https://img.shields.io/badge/ORCID-0000--0002--1844--9557-green.svg)](https://orcid.org/0000-0002-1844-9557) |
| :---: | :---: | :---: |

</div>

> [!IMPORTANT]
> ### 🤝🏻 Special Acknowledgement
> *Special thanks to **[Hasan Rizvi](https://github.com/rizvihasan)** and **[Mega Satish](https://github.com/msatmod)** for their meaningful contributions, guidance, and support that helped shape this work.*

---

<!-- OVERVIEW -->
## Overview

**White-Box Cartoonization** is an advanced AI implementation designed to bridge the gap between real-world imagery and artistic cartoon representations. Unlike black-box models, this system decomposes images into several representations (surface, structure, and texture) to achieve high-quality stylization while maintaining the structural integrity of the input.

Developed as a mini-project for the **Machine Learning Laboratory** curriculum, this project integrates cutting-edge deep learning research with a production-ready Flask web gateway, demonstrating the end-to-end lifecycle of an AI application.

<div align="center">
  <img src="Mini-Project/Files/GAN-Tree.gif" alt="GAN Learning Progression">
</div>

> [!NOTE]
> **Research Impact & Certification**
>
> This project was published as a research paper in the **International Journal of Engineering Applied Sciences and Technology (IJEAST)** (Volume 5, Issue 12) and is also available as a preprint on **arXiv**. The project received an official **Publication Certificate** for its research contribution to machine learning education.
>
> - [Preprint @arXiv](https://arxiv.org/abs/2107.04551)
> - [Published Paper @IJEAST](http://dx.doi.org/10.33564/IJEAST.2021.v05i12.049)
> - [Publication Certificate](Mini-Project/IJEAST-V5I12%20-%20White-Box%20Cartoonization%20Using%20An%20Extended%20GAN%20Framework.pdf)

### Resources

| # | Resource | Description | Date | Marks |
|---|---|---|---|---|
| 1 | [**Source Code**](Source%20Code/) | Complete production repository and weights | — | — |
| 2 | [**Technical Specification**](docs/SPECIFICATION.md) | System architecture and specifications | May 2021 | — |
| 3 | [**Technical Report**](Mini-Project/WHITE-BOX%20CARTOONIZATION%20USING%20AN%20EXTENDED%20GAN%20FRAMEWORK%20REPORT.pdf) | Comprehensive archival project documentation | 2021 | — |
| 4 | [**Technical Presentation**](Mini-Project/Presentation%20-%20MINI-PROJECT_PRESENTATION%20_TE-COMPS_B-50,51,58.pdf) | Visual overview of the model architecture | 2021 | — |
| 5 | [**Publication Certificate**](Mini-Project/IJEAST-V5I12%20-%20White-Box%20Cartoonization%20Using%20An%20Extended%20GAN%20Framework.pdf) | Recognition for research excellence | July 2021 | — |

> [!TIP]
> **Optimized Model Inference**
>
> For faster inference on high-resolution images, consider enabling GPU acceleration via TensorFlow-GPU. Ensure CUDA and cuDNN are correctly installed and configured to leverage parallel processing for the GAN's forward pass.

---

<!-- FEATURES -->
## Features

| Feature | Description |
|---------|-------------|
| **White-Box Logic** | Decomposition-based cartoonization for superior edge and texture control. |
| **GAN Framework** | Extended Generative Adversarial Network for realistic artistic textures. |
| **Optimized Inference** | Efficient model execution via TensorFlow with Guided Filter refinement. |
| **Cinematic Web UI** | Modern HTML/JS interface featuring clapper animations and soundscapes. |
| **Cross-Platform** | Fully responsive design supporting both desktop and mobile web environments. |
| **Archival Quality** | Production-ready code with comprehensive scholarly documentation. |

### Tech Stack
- **Framework**: TensorFlow 2.x
- **Backend**: Python 3.8+, Flask 3.1.2
- **Frontend**: Vanilla JS, CSS3 (Custom Theme System)
- **Utilities**: OpenCV, NumPy, Guided Filter algorithm

---

<!-- STRUCTURE -->
## Project Structure

```python
WHITE-BOX-CARTOONIZATION/
│
├── docs/                                    # Formal Documentation
│   └── SPECIFICATION.md                     # Technical Architecture & Specification
│
├── Mega/                                    # Archival Attribution Assets
│   ├── Filly.jpg                            # Companion (Filly)
│   └── Mega.png                             # Author Profile Image (Mega Satish)
│
├── Mini-Project/                            # Research, Demos & Training Materials
│   ├── Demo/                                # Functional System Demonstrations
│   ├── Draft/                               # Early Manuscripts & Design Drafts
│   ├── Experimental-Implementations/        # Node.js & TF.js Research
│   ├── Figures/                             # System Diagrams & Architecture
│   ├── Files/                               # Visualization & Research Data
│   │   └── GAN-Tree.gif                     # GAN Learning Progression
│   ├── Group - B11/                         # Official Academic Submission
│   ├── WBC/                                 # Core Training Script Manifest
│   ├── IJEAST-V5I12 - White-Box...          # Published Research Paper (IJEAST)
│   ├── Preprint - White-Box...              # Formal Research Manuscript (arXiv)
│   ├── MINI-PROJECT_PRESENTATION...         # Technical Presentation (PPTX)
│   └── WHITE-BOX CARTOONIZATION REPORT.pdf  # Comprehensive Project Report
│
├── Source Code/                             # Real-Time Web Application (Flask)
│   ├── src/                                 # Core Inference Framework
│   ├── static/                              # Frontend Presentation Assets
│   ├── app.py                               # Flask Web Entry Gateway
│   ├── backend.py                           # GAN Processing Liaison
│   └── index.html                           # Application Frontend Blueprint
│
├── .gitattributes                           # Global Git LFS & Config
├── .gitignore                               # Asset Exclusion Manifest
├── requirements.txt                         # Dependency Manifest
├── CITATION.cff                             # Scholarly Citation Metadata
├── codemeta.json                            # Software Metadata Manifest
├── LICENSE                                  # MIT License Terms
├── README.md                                # Comprehensive Archival Entrance
└── SECURITY.md                              # Vulnerability Exposure Policy
```

---

<!-- RESULTS -->
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

<!-- QUICK START -->
## Quick Start

### 1. Prerequisites
Ensure your environment meets the minimum specifications:
- **Python**: Version **3.8** or higher.
- **Hardware**: 4GB Minimum RAM (8GB recommended for inference).
- **Environment**: Virtual environment (venv) is highly recommended.

> [!WARNING]
> **Technical Dependencies & Environment**
>
> This system is built using **TensorFlow 2.x** and **Python 3.8+**. For stable execution and educational reference, it is recommended to run this in an isolated virtual environment to align with the baseline deep learning framework requirements and avoid dependency conflicts.

### 2. Setup & Deployment
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Amey-Thakur/WHITE-BOX-CARTOONIZATION.git
    cd WHITE-BOX-CARTOONIZATION
    ```
2.  **Install Dependencies**:
    ```bash
    pip install flask flask-cors tensorflow opencv-python numpy tf-slim
    ```

### 3. Launch Application
1.  **Start the Server**:
    ```bash
    cd "Source Code"
    python app.py
    ```
2.  **Access Web Gateway**:
    -   Navigate to: `http://localhost:5002`

---

<!-- =========================================================================================
                                     USAGE SECTION
     ========================================================================================= -->
## Usage Guidelines

This repository is openly shared to support learning and knowledge exchange across the academic community.

**For Students**  
Use this mini-project as a reference for understanding Generative Adversarial Networks (GANs), white-box image representations, and the deployment of AI models via web-based gateways. The research assets and production scripts are documented to support self-paced learning and exploration of computer vision applications.

**For Educators**  
This project may serve as a practical example or supplementary teaching resource for Machine Learning curriculum or Mini-Project modules (`CSM605`). Attribution is appreciated when utilizing content.

**For Researchers**  
The published paper and preprint provide insights into image decomposition techniques, high-quality artistic stylization using GANs, and the refinement of edge/texture control in generative models.

---

<!-- LICENSE -->
## License

This repository and all linked academic content are made available under the **MIT License**. See the [LICENSE](LICENSE) file for complete terms.

> [!NOTE]
> **Summary**: You are free to share and adapt this content for any purpose, even commercially, as long as you provide appropriate attribution to the original author.

Copyright © 2021 Amey Thakur, Hasan Rizvi, Mega Satish

---

<!-- ABOUT -->
## About This Repository

**Created & Maintained by**: [Amey Thakur](https://github.com/Amey-Thakur), [Hasan Rizvi](https://github.com/rizvihasan) & [Mega Satish](https://github.com/msatmod)  
**Academic Journey**: Bachelor of Engineering in Computer Engineering (2018-2022)  
**Institution**: [Terna Engineering College](https://ternaengg.ac.in/), Navi Mumbai  
**University**: [University of Mumbai](https://mu.ac.in/)

This repository serves as a permanent technical record for **White-Box Cartoonization**, developed as a **6th Semester Mini-Project**. It highlights the practical application of GANs in artistic rendering and the deployment of AI models via modern web interfaces.

**Connect:** [GitHub](https://github.com/Amey-Thakur) &nbsp;·&nbsp; [LinkedIn](https://www.linkedin.com/in/amey-thakur) &nbsp;·&nbsp; [ORCID](https://orcid.org/0000-0001-5644-1575)

### Acknowledgments

Grateful acknowledgment to [**Hasan Rizvi**](https://github.com/rizvihasan) and [**Mega Satish**](https://github.com/msatmod) for their exceptional collaboration and scholarly partnership during the development of this project. Their constant support, technical clarity, and dedication to software quality were instrumental in achieving the system's functional objectives. Learning alongside them was a transformative experience; their thoughtful approach to problem-solving and steady encouragement turned complex requirements into meaningful learning moments. This work reflects the growth and insights gained from our side-by-side academic journey. Thank you, Hasan and Mega, for everything you shared and taught along the way.

Grateful acknowledgment to the faculty members of the **Department of Computer Engineering** at Terna Engineering College for their guidance and instruction in Machine Learning. Their expertise in neural networks and generative models helped me develop a strong understanding of professional AI development methodologies.

Special thanks to the authors of *"Learning to Cartoonize Using White-box Cartoon Representations"* (Xinrui Wang and Jinze Yu, CVPR 2020) for their foundational research.

---

<div align="center">

  [↑ Back to Top](#readme-top)

  [Authors](#authors) &nbsp;·&nbsp; [Overview](#overview) &nbsp;·&nbsp; [Features](#features) &nbsp;·&nbsp; [Structure](#project-structure) &nbsp;·&nbsp; [Results](#results-gallery) &nbsp;·&nbsp; [Quick Start](#quick-start) &nbsp;·&nbsp; [Usage Guidelines](#usage-guidelines) &nbsp;·&nbsp; [License](#license) &nbsp;·&nbsp; [About](#about-this-repository) &nbsp;·&nbsp; [Acknowledgments](#acknowledgments)

  <br>

  🎬 **[White Box Cartoonization](https://huggingface.co/spaces/ameythakur/white-box-cartoonization)**

  ---

  #### Presented as part of the 6th Semester Mini-Project @ Terna Engineering College

  ---

  ### 🎓 [Computer Engineering Repository](https://github.com/Amey-Thakur/COMPUTER-ENGINEERING)

  **Computer Engineering (B.E.) - University of Mumbai**

  *Semester-wise curriculum, laboratories, projects, and academic notes.*

</div>


