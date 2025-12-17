"""
app.py
=============================================================================
This is the main entry point for the Flask web application.
It acts as a server that:
1.  Serves the webpage (`index.html`) to the user's browser.
2.  Receives images uploaded by the user via the `/cartoonize` route.
3.  Sends those images to the `backend.py` module for processing.
4.  Returns the cartoonized result back to the user.
=============================================================================
"""
import os
import io
from flask import Flask, request, send_file
from backend import Cartoonizer

# Initialize the Flask application
# static_folder='static': Tells Flask where to find CSS and JS files
# template_folder='.': Tells Flask where to find HTML files (current directory)
app = Flask(__name__, static_folder='static', template_folder='.')

# Define the path to the pre-trained machine learning model
# We use os.path.join to ensure it works on Windows, Mac, and Linux
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'src', 'saved_models')

print(f"Loading model from {MODEL_PATH}...")
print("Please wait, this may take a few seconds...")

# Initialize the Cartoonizer. This loads the AI model into memory ONCE.
# We do this here so we don't have to reload it for every single image (which would be slow).
cartoonizer = Cartoonizer(MODEL_PATH)

@app.route('/')
def index():
    """
    Route: Homepage (/)
    Purpose: Serves the main website (index.html).
    """
    return send_file('index.html')

@app.route('/cartoonize', methods=['POST'])
def cartoonize():
    """
    Route: /cartoonize
    Method: POST (Sending data to server)
    Purpose: Accepts an uploaded image, runs the AI model, and returns the result.
    """
    # 1. Check if the request contains a file
    if 'file' not in request.files:
        return "No file part", 400
    
    file = request.files['file']
    
    # 2. Check if the user selected a file
    if file.filename == '':
        return "No selected file", 400
    
    try:
        # 3. Read the image data from the upload
        image_bytes = file.read()
        
        # 4. Pass the data to our AI model to get the cartoon version
        result_bytes = cartoonizer.predict(image_bytes)
        
        # 5. Send the result back to the browser as a JPEG image
        return send_file(
            io.BytesIO(result_bytes),
            mimetype='image/jpeg'
        )
    except Exception as e:
        print(f"Error processing image: {e}")
        return str(e), 500

if __name__ == '__main__':
    # Start the server on all network interfaces (0.0.0.0) so it's accessible from mobile devices
    # debug=True allows for easier error messages during development
    print("Server starting on http://localhost:5002")
    print("Also accessible on your network at http://192.168.12.3:5002")
    app.run(host='0.0.0.0', debug=True, port=5002)
