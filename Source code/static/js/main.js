/**
 * main.js
 * =============================================================================
 * This file handles the behavior of the webpage.
 * It manages:
 * 1. Selecting and previewing images.
 * 2. Sending the image to the backend server.
 * 3. Displaying the resulting cartoonized image.
 * 4. Keyboard shortcuts for power users.
 * =============================================================================
 */

// Grab references to all the important elements on the page
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const inputImage = document.getElementById('inputImage');
const inputPlaceholder = document.getElementById('inputPlaceholder');
const outputImage = document.getElementById('outputImage');
const outputPlaceholder = document.getElementById('outputPlaceholder');
const saveBtn = document.getElementById('saveBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const cameraBtn = document.getElementById('cameraBtn');
const cameraInput = document.getElementById('cameraInput');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const copyBtn = document.getElementById('copyBtn');

// State tracking for toggle functionality
let isShowingOriginal = false;
let hasProcessedImage = false;

// Mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.matchMedia && window.matchMedia("(max-width: 768px)").matches);

// Camera button is now visible on all devices (laptops also have cameras!)
if (cameraBtn) {
    cameraBtn.style.display = 'inline-block';
}

// Event Listener: Upload Trigger
if (uploadBtn && fileInput) {
    uploadBtn.addEventListener('click', () => fileInput.click());
}

// Camera Modal Elements
const cameraModal = document.getElementById('cameraModal');
const cameraVideo = document.getElementById('cameraVideo');
const cameraCanvas = document.getElementById('cameraCanvas');
const captureBtn = document.getElementById('captureBtn');
const closeCameraBtn = document.getElementById('closeCameraBtn');

// Event Listener: Camera Trigger
if (cameraBtn) {
    cameraBtn.addEventListener('click', () => {
        if (isMobile) {
            // Mobile: Use native camera input
            if (cameraInput) {
                cameraInput.click();
                showNotification("Camera Opening...");
            }
        } else {
            // Desktop: Open Webcam Modal
            openCameraModal();
        }
    });
}

// Desktop Camera Functions
async function openCameraModal() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraVideo.srcObject = stream;
        cameraModal.classList.remove('hidden');
        cameraModal.style.pointerEvents = 'auto'; // Ensure clicks work
        cameraModal.style.opacity = '1';
    } catch (err) {
        console.error("Error accessing camera:", err);
        showNotification("Camera Access Denied");
        alert("Could not access camera. Please allow camera permissions.");
    }
}

function stopCamera() {
    const stream = cameraVideo.srcObject;
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }
    cameraVideo.srcObject = null;
    cameraModal.classList.add('hidden');
    cameraModal.style.pointerEvents = 'none';
    cameraModal.style.opacity = '0';
}

// Capture Photo Logic
// Editor Modal Elements
const editorModal = document.getElementById('editorModal');
const editorImage = document.getElementById('editorImage');
const cropBtn = document.getElementById('cropBtn');
const rotateSlider = document.getElementById('rotateSlider');
const cancelEditBtn = document.getElementById('cancelEditBtn');

let cropper = null;

// Capture Photo Logic
if (captureBtn) {
    captureBtn.addEventListener('click', () => {
        const context = cameraCanvas.getContext('2d');

        // Ensure video has dimensions
        if (cameraVideo.videoWidth === 0 || cameraVideo.videoHeight === 0) {
            alert("Error: Video stream not ready yet.");
            return;
        }

        cameraCanvas.width = cameraVideo.videoWidth;
        cameraCanvas.height = cameraVideo.videoHeight;
        context.drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);

        // Convert to blob and open editor
        cameraCanvas.toBlob(blob => {
            if (!blob) {
                alert("Error: Failed to create image blob.");
                return;
            }

            const url = URL.createObjectURL(blob);
            stopCamera(); // Close camera first
            openEditor(url);
        }, 'image/jpeg');
    });
}

// Editor Functions
function openEditor(imageUrl) {
    // Check if Cropper is loaded
    if (typeof Cropper === 'undefined') {
        alert("Error: Cropper.js library is not loaded. Please check your internet connection.");
        return;
    }

    editorImage.src = imageUrl;
    editorModal.classList.remove('hidden');

    // Explicitly show the modal (override CSS opacity: 0)
    editorModal.style.opacity = '1';
    editorModal.style.pointerEvents = 'auto';

    // Reset slider
    if (rotateSlider) rotateSlider.value = 0;

    // Initialize Cropper
    if (cropper) {
        cropper.destroy();
    }

    cropper = new Cropper(editorImage, {
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 0.9,
        responsive: true,
        background: false,
        guides: true,
        center: true,
        highlight: false,
    });
}

function closeEditor() {
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
    editorModal.classList.add('hidden');
    editorModal.style.opacity = '0';
    editorModal.style.pointerEvents = 'none';
}

// Editor Event Listeners
if (cropBtn) {
    cropBtn.addEventListener('click', () => {
        if (!cropper) return;

        // Get cropped canvas
        const canvas = cropper.getCroppedCanvas();

        canvas.toBlob((blob) => {
            // Create file and process
            const file = new File([blob], "edited-capture.jpg", { type: "image/jpeg" });
            processImage(file);

            // Set input preview
            const url = URL.createObjectURL(blob);
            inputImage.src = url;
            inputImage.classList.remove('hidden');
            inputPlaceholder.classList.add('hidden');

            closeEditor();
        }, 'image/jpeg');
    });
}

if (rotateSlider) {
    rotateSlider.addEventListener('input', (e) => {
        if (cropper) {
            cropper.rotateTo(parseInt(e.target.value));
        }
    });
}

if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', closeEditor);
}

if (closeCameraBtn) {
    closeCameraBtn.addEventListener('click', stopCamera);
}

// Event Listener: Camera Input Change
if (cameraInput) {
    cameraInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (!file.type.match('image.*')) {
                alert("Error: Please capture a valid image.");
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                inputImage.src = event.target.result;
                inputImage.classList.remove('hidden');
                inputPlaceholder.classList.add('hidden');
                processImage(file);
            }
            reader.readAsDataURL(file);
        }
    });
}

// Drag & Drop Logic
const dropZone = document.getElementById('inputDropZone');

if (dropZone) {
    // Prevent default behaviors for drag events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight drop zone
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('highlight-drop'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('highlight-drop'), false);
    });

    // Handle Drop
    dropZone.addEventListener('drop', handleDrop, false);

    // Handle Click (to open file dialog)
    dropZone.addEventListener('click', () => fileInput.click());
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files && files[0]) {
        const file = files[0];
        if (!file.type.match('image.*')) {
            alert("Error: Please select a valid image file.");
            return;
        }

        // Show preview immediately
        const reader = new FileReader();
        reader.onload = (event) => {
            inputImage.src = event.target.result;
            inputImage.classList.remove('hidden');
            inputPlaceholder.classList.add('hidden');

            // Process
            processImage(file);
        }
        reader.readAsDataURL(file);
    }
}

// Event Listener: File Selected (Input)
if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // 1. Validation: Ensure it's an image
            if (!file.type.match('image.*')) {
                alert("Error: Please select a valid image file (jpg, png, etc).");
                return;
            }

            // 2. Preview: Use FileReader to verify and show the image locally
            const reader = new FileReader();

            reader.onload = (event) => {
                // Set the Image tag source to the loaded file data
                inputImage.src = event.target.result;

                // Show the image, hide the placeholder text
                inputImage.classList.remove('hidden');
                inputPlaceholder.classList.add('hidden');

                // 3. Process: Automatically send the file to the backend
                processImage(file);
            }

            // Start reading the file
            reader.readAsDataURL(file);
        }
    });
}

// Event Listener: 🎬 Clapper Animation (Cinematic Intro)
const clapperIcon = document.getElementById('clapperIcon');
const movieOverlay = document.getElementById('movieOverlay');
const cinematicTitle = document.querySelector('.cinematic-title');
const cinematicCredits = document.querySelector('.cinematic-credits');

// =============================================================================
// AMBIENT MUSICAL SOUNDSCAPE: Gentle, pleasant background music
// Creates a soothing, cinematic atmosphere
// =============================================================================
function playMagicalSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const now = ctx.currentTime;
        const duration = 6.5;

        // =====================================================================
        // MASTER OUTPUT: Warm, pleasant filtering
        // =====================================================================
        const masterGain = ctx.createGain();
        const masterFilter = ctx.createBiquadFilter();
        masterFilter.type = 'lowpass';
        masterFilter.frequency.value = 4000; // Balanced warmth
        masterFilter.Q.value = 0.7;
        masterGain.connect(masterFilter);
        masterFilter.connect(ctx.destination);

        // Master envelope: Gentle musical swell
        masterGain.gain.setValueAtTime(0, now);
        masterGain.gain.linearRampToValueAtTime(0.08, now + 1.5);
        masterGain.gain.linearRampToValueAtTime(0.10, now + 3.0);
        masterGain.gain.linearRampToValueAtTime(0.08, now + 5.0);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        // =====================================================================
        // LAYER 1: Warm bass foundation (musical root note)
        // =====================================================================
        const bass = ctx.createOscillator();
        const bassGain = ctx.createGain();
        const bassFilter = ctx.createBiquadFilter();

        bass.type = 'triangle';
        bass.frequency.value = 82.41; // E2 - warm and musical

        bassFilter.type = 'lowpass';
        bassFilter.frequency.value = 200;

        bassGain.gain.setValueAtTime(0, now);
        bassGain.gain.linearRampToValueAtTime(0.12, now + 2.0);
        bassGain.gain.linearRampToValueAtTime(0.10, now + 5.0);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        bass.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(masterGain);
        bass.start(now);
        bass.stop(now + duration);

        // =====================================================================
        // LAYER 2: Lush pad chord (Emaj7 - dreamy and uplifting)
        // E3, G#3, B3, D#4
        // =====================================================================
        const padNotes = [164.81, 207.65, 246.94, 311.13];
        padNotes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.value = freq;
            osc.detune.value = (Math.random() - 0.5) * 4; // Subtle chorus

            filter.type = 'lowpass';
            filter.frequency.value = 2500;
            filter.Q.value = 0.5;

            // Gentle swell for each note
            gain.gain.setValueAtTime(0, now + 0.5);
            gain.gain.linearRampToValueAtTime(0.05, now + 2.0 + (i * 0.15));
            gain.gain.linearRampToValueAtTime(0.04, now + 5.5);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(masterGain);
            osc.start(now + 0.5);
            osc.stop(now + duration);
        });

        // =====================================================================
        // LAYER 3: Gentle melodic motif (simple, pleasant melody)
        // =====================================================================
        const melody = [
            { freq: 329.63, time: 1.8, duration: 0.8 },  // E4
            { freq: 392.00, time: 2.8, duration: 0.6 },  // G4
            { freq: 493.88, time: 3.6, duration: 1.0 },  // B4
            { freq: 392.00, time: 4.8, duration: 0.8 }   // G4
        ];

        melody.forEach(note => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.value = note.freq;

            filter.type = 'lowpass';
            filter.frequency.value = 3000;

            // Natural envelope (attack-decay-sustain-release)
            const start = now + note.time;
            const end = start + note.duration;

            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.04, start + 0.05); // Quick attack
            gain.gain.linearRampToValueAtTime(0.03, start + 0.15); // Slight decay
            gain.gain.linearRampToValueAtTime(0.025, end - 0.2);   // Sustain
            gain.gain.exponentialRampToValueAtTime(0.001, end);    // Release

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(masterGain);
            osc.start(start);
            osc.stop(end);
        });

        // =====================================================================
        // LAYER 4: Subtle high shimmer (adds air and space)
        // =====================================================================
        const shimmer = ctx.createOscillator();
        const shimmerGain = ctx.createGain();
        const shimmerFilter = ctx.createBiquadFilter();

        shimmer.type = 'sine';
        shimmer.frequency.value = 987.77; // B5

        // Gentle LFO for shimmer effect
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.value = 2.5;
        lfoGain.gain.value = 4;
        lfo.connect(lfoGain);
        lfoGain.connect(shimmer.detune);

        shimmerFilter.type = 'highpass';
        shimmerFilter.frequency.value = 800;

        shimmerGain.gain.setValueAtTime(0, now + 2.5);
        shimmerGain.gain.linearRampToValueAtTime(0.015, now + 3.5);
        shimmerGain.gain.linearRampToValueAtTime(0.012, now + 5.5);
        shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        shimmer.connect(shimmerFilter);
        shimmerFilter.connect(shimmerGain);
        shimmerGain.connect(masterGain);

        lfo.start(now + 2.5);
        shimmer.start(now + 2.5);
        lfo.stop(now + duration);
        shimmer.stop(now + duration);

    } catch (e) {
        console.log("Audio not supported or blocked", e);
    }
}

if (clapperIcon && movieOverlay) {
    clapperIcon.addEventListener('click', triggerCinematicIntro);
}

function triggerCinematicIntro() {
    // 0. Play Sound
    playMagicalSound();

    // 1. Show Overlay
    movieOverlay.classList.remove('hidden');
    // Force reflow
    void movieOverlay.offsetWidth;
    movieOverlay.classList.add('playing');

    // 2. Trigger Animations
    cinematicTitle.classList.remove('animate-title');
    cinematicCredits.classList.remove('animate-credits');

    void cinematicTitle.offsetWidth; // Reflow

    cinematicTitle.classList.add('animate-title');
    cinematicCredits.classList.add('animate-credits');

    // 3. Hide after 6 seconds (duration of full sequence)
    setTimeout(() => {
        movieOverlay.classList.remove('playing');
        setTimeout(() => {
            movieOverlay.classList.add('hidden');
        }, 1000); // Wait for fade out transition
    }, 5500);
}

/**
 * Resize image to a maximum dimension while maintaining aspect ratio.
 * @param {File} file - The original image file.
 * @param {number} maxDimension - The maximum width or height.
 * @param {number} quality - JPEG quality (0.0 to 1.0).
 * @returns {Promise<Blob>} - The resized image blob.
 */
function resizeImage(file, maxDimension, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = Math.round(height * (maxDimension / width));
                        width = maxDimension;
                    } else {
                        width = Math.round(width * (maxDimension / height));
                        height = maxDimension;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/jpeg', quality);
            };
            img.onerror = (err) => reject(new Error("Image load failed"));
            img.src = e.target.result;
        };
        reader.onerror = (err) => reject(new Error("File read failed"));
        reader.readAsDataURL(file);
    });
}

/**
 * Sends the image to the Python backend and handles the response.
 * @param {File} file - The image file object selected by the user.
 */
async function processImage(file) {
    // State 1: Loading
    // Hide previous results, show the spinner
    outputImage.classList.add('hidden');
    outputPlaceholder.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');
    saveBtn.classList.add('hidden');
    if (copyBtn) copyBtn.classList.add('hidden');
    hasProcessedImage = false;
    isShowingOriginal = false;

    // Trigger Clapper Animation (Subtle)
    if (clapperIcon) clapperIcon.classList.add('clapper-processing');

    try {
        // 0. OPTIMIZATION: Resize image client-side before upload
        console.log("Starting image resize...");
        const resizedBlob = await resizeImage(file, 1024, 0.85);
        console.log("Resize complete. Original size:", file.size, "New size:", resizedBlob.size);

        // Prepare the data to be sent (like a form submission)
        const formData = new FormData();
        formData.append('file', resizedBlob, "optimized_image.jpg");

        console.log("Sending upload request...");
        // Send a POST request to our server at /cartoonize
        const response = await fetch('/cartoonize', {
            method: 'POST',
            body: formData
        });

        console.log("Response received:", response.status);

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        // The server returns the image as a 'blob' (Binary Large Object)
        const blob = await response.blob();
        console.log("Result blob received size:", blob.size);

        // Create a URL for this blob so the <img> tag can display it
        const imageUrl = URL.createObjectURL(blob);

        // State 2: Success
        // Show the cartoonized image
        outputImage.src = imageUrl;
        outputImage.classList.remove('hidden');
        hasProcessedImage = true;

        // Configure the Save button
        saveBtn.href = imageUrl;

        // Ensure the downloaded filename ends with .jpg
        // Logic: Strip original extension (if any) and append .jpg
        let originalName = file.name;
        const lastDotIndex = originalName.lastIndexOf('.');

        // If there is an extension, remove it
        if (lastDotIndex !== -1) {
            originalName = originalName.substring(0, lastDotIndex);
        }

        let downloadName = "Cartoonized_" + originalName + ".jpg";
        saveBtn.download = downloadName;

        saveBtn.classList.remove('hidden');
        if (copyBtn) copyBtn.classList.remove('hidden');

    } catch (error) {
        // State 3: Error
        console.error("Error in processImage:", error);
        alert(`Failed: ${error.message}`);

        outputPlaceholder.classList.remove('hidden');
        outputPlaceholder.innerHTML = `<span>Error: ${error.message}</span>`;
    } finally {
        // Always hide the loading spinner, regardless of success or failure
        loadingSpinner.classList.add('hidden');
        // Reset status text
        const statusText = loadingSpinner.querySelector('p');
        if (statusText) statusText.textContent = "Sketching your cartoon...";

        // Stop Clapper Animation
        if (clapperIcon) clapperIcon.classList.remove('clapper-processing');
    }
}

/**
 * Toggle between original and cartoonized image
 */
function toggleBeforeAfter() {
    if (!hasProcessedImage) {
        showNotification("Process an image first!");
        return;
    }

    if (!isShowingOriginal) {
        // Show original on the right
        const originalSrc = inputImage.src;
        outputImage.dataset.cartoonSrc = outputImage.src;
        outputImage.src = originalSrc;
        isShowingOriginal = true;
        showNotification("Showing Original");
    } else {
        // Show cartoon on the right
        outputImage.src = outputImage.dataset.cartoonSrc;
        isShowingOriginal = false;
        showNotification("Showing Cartoonized");
    }
}

/**
 * Reset the application
 */
function resetApp() {
    inputImage.src = '';
    inputImage.classList.add('hidden');
    inputPlaceholder.classList.remove('hidden');

    outputImage.src = '';
    outputImage.classList.add('hidden');
    outputPlaceholder.classList.remove('hidden');

    saveBtn.classList.add('hidden');
    if (copyBtn) copyBtn.classList.add('hidden');
    loadingSpinner.classList.add('hidden');

    fileInput.value = '';
    hasProcessedImage = false;
    isShowingOriginal = false;

    showNotification("Reset Complete");
}

/**
 * Show keyboard shortcuts help
 */
function showKeyboardHelp() {
    const helpMessage = `
⌨️ KEYBOARD SHORTCUTS:

U - Upload Image
P - Take Photo (Camera)
S - Save/Download Image
SPACE - Toggle Before/After
R - Reset Application
C - Play Cinematic Intro
F - Toggle Fullscreen
T - Toggle Theme (Dark/Light)
ESC - Close Overlays
? or H - Show This Help

💡 TIP: Use these shortcuts for faster workflow!
    `.trim();

    alert(helpMessage);
}

/**
 * Show notification toast
 */
function showNotification(message) {
    // Remove existing notification if any
    const existing = document.querySelector('.keyboard-notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'keyboard-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove after 2 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

/**
 * Keyboard Shortcuts Handler
 */
document.addEventListener('keydown', (e) => {
    // Don't trigger shortcuts if user is typing in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }

    const key = e.key.toLowerCase();

    switch (key) {
        case 'u':
            // Upload Image
            e.preventDefault();
            fileInput.click();
            showNotification("Upload Image");
            break;

        case 's':
            // Save Image
            e.preventDefault();
            if (!saveBtn.classList.contains('hidden')) {
                saveBtn.click();
                showNotification("Downloading...");
            } else {
                showNotification("No image to save yet!");
            }
            break;

        case ' ':
            // Toggle Before/After (Spacebar)
            e.preventDefault();
            toggleBeforeAfter();
            break;

        case 'r':
            // Reset Application
            e.preventDefault();
            if (confirm("Reset the application? This will clear all images.")) {
                resetApp();
            }
            break;

        case 'c':
            // Play Cinematic Intro
            e.preventDefault();
            triggerCinematicIntro();
            showNotification("Action!");
            break;

        case 'escape':
            // Close any open overlays
            e.preventDefault();
            if (movieOverlay && !movieOverlay.classList.contains('hidden')) {
                movieOverlay.classList.remove('playing');
                setTimeout(() => movieOverlay.classList.add('hidden'), 300);
            }
            showNotification("Closed");
            break;

        case '?':
            // Show Help
            e.preventDefault();
            showKeyboardHelp();
            break;

        case 'h':
            // Alternative Help key
            e.preventDefault();
            showKeyboardHelp();
            break;

        case 'f':
            // Toggle Fullscreen
            e.preventDefault();
            toggleFullscreen();
            break;

        case 'p':
            // Take Photo (Camera)
            e.preventDefault();
            if (cameraInput) {
                cameraInput.click();
                showNotification("📷 Camera Opening...");
            }
            break;

        case 't':
            // Toggle Theme
            e.preventDefault();
            toggleTheme();
            break;

        default:
            // Do nothing for other keys
            break;
    }
});

// Show welcome message on page load
window.addEventListener('load', () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║   WHITE-BOX CARTOONIZATION v2.0       ║
    ║   Press '?' for keyboard shortcuts     ║
    ╚════════════════════════════════════════╝
    `);
});

// =============================================================================
// 🌈 THEME TOGGLE SYSTEM - Dark/Light Mode
// =============================================================================

const themeToggle = document.getElementById('themeToggle');
const THEME_KEY = 'wbc-theme'; // LocalStorage key

/**
 * Initialize theme from localStorage on page load
 */
function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);

    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        updateThemeIcon(true);
    } else {
        // Default is dark mode
        document.body.classList.remove('light-mode');
        updateThemeIcon(false);
    }
}

/**
 * Toggle between dark and light mode
 */
function toggleTheme() {
    const isLightMode = document.body.classList.toggle('light-mode');

    // Save preference to localStorage
    localStorage.setItem(THEME_KEY, isLightMode ? 'light' : 'dark');

    // Update icon
    updateThemeIcon(isLightMode);

    // Show notification
    showNotification(isLightMode ? 'Light Mode' : 'Dark Mode');
}

/**
 * Update the theme toggle button icon
 */
function updateThemeIcon(isLightMode) {
    if (themeToggle) {
        themeToggle.textContent = isLightMode ? '☀️' : '🌙';
        themeToggle.title = isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    }
}

// Event listener for theme toggle button
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Event listener for Copy Button
if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
        if (!outputImage.src) return;

        /**
         * NOTE: The Clipboard API requires a Secure Context (HTTPS).
         * If accessing via http://localhost or a local IP (http://192.168...), this API might be blocked.
         * We check for its existence first.
         */
        if (!navigator.clipboard) {
            alert("Clipboard API not available. This feature requires HTTPS.\n\nOn mobile: Long-press the image to copy/save.");
            return;
        }

        try {
            // Draw to canvas to covert to PNG
            const canvas = document.createElement('canvas');
            canvas.width = outputImage.naturalWidth;
            canvas.height = outputImage.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(outputImage, 0, 0);

            // Wrap toBlob in Promise for cleaner async handling
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

            if (!blob) {
                showNotification("Copy failed (Blob error)");
                return;
            }

            await navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': blob
                })
            ]);
            showNotification("Image Copied");

        } catch (err) {
            console.error("Copy failed:", err);
            // Fallback message for user
            alert("Copy failed (Browser restriction).\n\nPlease Long-Press the image to copy.");
        }
    });
}

// Initialize theme on page load
initTheme();

// =============================================================================
// 📱 MOBILE FEATURES: Fullscreen, Touch Gestures, Pinch-to-Zoom
// =============================================================================

/**
 * Fullscreen Toggle Functionality
 */
if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        // Enter fullscreen
        document.documentElement.requestFullscreen().then(() => {
            fullscreenBtn.textContent = '⛶'; // Exit fullscreen icon
            showNotification("Fullscreen Mode");
        }).catch(err => {
            console.error('Error attempting fullscreen:', err);
            showNotification("Fullscreen not available");
        });
    } else {
        // Exit fullscreen
        document.exitFullscreen().then(() => {
            fullscreenBtn.textContent = '⛶'; // Enter fullscreen icon
            showNotification("Exited Fullscreen");
        });
    }
}

// Listen for fullscreen changes
document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        fullscreenBtn.textContent = '↙️'; // Exit icon when in fullscreen
    } else {
        fullscreenBtn.textContent = '⛶'; // Enter icon when not in fullscreen
    }
});

/**
 * Touch Gestures: Pinch-to-Zoom for Output Image
 */
let scale = 1;
let lastDistance = 0;
let isPinching = false;

if (outputImage && isMobile) {
    let touchStartX = 0;
    let touchEndX = 0;

    // Pinch to Zoom
    outputImage.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            isPinching = true;
            lastDistance = getDistance(e.touches[0], e.touches[1]);
            e.preventDefault();
        } else if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
        }
    }, { passive: false });

    outputImage.addEventListener('touchmove', (e) => {
        if (isPinching && e.touches.length === 2) {
            const currentDistance = getDistance(e.touches[0], e.touches[1]);
            const delta = currentDistance - lastDistance;

            scale += delta * 0.01;
            scale = Math.min(Math.max(0.5, scale), 3); // Limit scale between 0.5x and 3x

            outputImage.style.transform = `scale(${scale})`;
            outputImage.style.transition = 'none';

            lastDistance = currentDistance;
            e.preventDefault();
        }
    }, { passive: false });

    outputImage.addEventListener('touchend', (e) => {
        if (isPinching && e.touches.length < 2) {
            isPinching = false;
            outputImage.style.transition = 'transform 0.3s ease';

            if (scale !== 1) {
                showNotification(`Zoom: ${Math.round(scale * 100)}%`);
            }
        } else if (e.touches.length === 0 && touchStartX > 0) {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
        }
    });

    // Swipe Gesture for Before/After Toggle
    function handleSwipe() {
        const swipeThreshold = 50; // minimum distance for swipe
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold && hasProcessedImage) {
            if (diff > 0) {
                // Swipe left - could add more features here
                toggleBeforeAfter();
            } else {
                // Swipe right - toggle back
                toggleBeforeAfter();
            }
        }

        touchStartX = 0;
        touchEndX = 0;
    }

    // Double tap to reset zoom
    let lastTap = 0;
    outputImage.addEventListener('touchend', (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;

        if (tapLength < 300 && tapLength > 0) {
            // Double tap detected
            scale = 1;
            outputImage.style.transform = 'scale(1)';
            outputImage.style.transition = 'transform 0.3s ease';
            showNotification("Zoom Reset");
            e.preventDefault();
        }
        lastTap = currentTime;
    });
}

// Helper function to calculate distance between two touch points
function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Prevent default touch behavior on image areas to enable custom gestures
 */
[inputImage, outputImage].forEach(img => {
    if (img && isMobile) {
        img.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }
});

/**
 * Mobile-specific: Prevent pull-to-refresh on the main container
 */
if (isMobile) {
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
        let startY = 0;

        mainContainer.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        }, { passive: true });

        mainContainer.addEventListener('touchmove', (e) => {
            const y = e.touches[0].clientY;
            // Prevent pull-to-refresh if scrolling down at the top
            if (window.scrollY === 0 && y > startY) {
                e.preventDefault();
            }
        }, { passive: false });
    }
}

/**
 * Orientation Change Handler for Mobile
 */
if (isMobile) {
    window.addEventListener('orientationchange', () => {
        showNotification("Orientation Changed");
        // Reset zoom on orientation change
        if (outputImage) {
            scale = 1;
            outputImage.style.transform = 'scale(1)';
        }
    });
}


