FROM python:3.9-slim

# Set working directory to the root of the app relative to the build context
WORKDIR /app

# Install system dependencies required for OpenCV
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements from the root (since we will build from repo root)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Source Code directory contents into /app
# This puts app.py directly in /app
COPY ["Source Code/", "/app/"]

# Create a user to run the app (security best practice)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Expose the Hugging Face port
EXPOSE 7860

# Run the Flask app
CMD ["python", "app.py"]
