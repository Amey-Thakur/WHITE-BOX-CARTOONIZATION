tf.setBackend('wasm').then(() => runModel()).catch(e => {
  console.error("WASM backend failed, falling back to WebGL", e);
  tf.setBackend('webgl').then(() => runModel()).catch(err => {
    console.error("WebGL failed, falling back to CPU", err);
    tf.setBackend('cpu').then(() => runModel());
  });
});

const APP = {
  model: null, size: 600,
  get source() { return document.getElementById('input') },
  get canvas() { return document.getElementById('output') },
  get status() { return document.getElementById('status') },
  get download() { return document.getElementById('download') },
  $: n => document.getElementById(n),
  path: 'web-uint8/model.json'
}

// Set up the image onload handler IMMEDIATELY so UI updates work even if model is loading
APP.source.onload = () => {
  console.log("Image loaded, updating UI");
  // Show the input image immediately
  APP.source.classList.remove('d-none');
  APP.source.classList.add('d-block');

  // Reset output canvas
  APP.canvas.classList.add('d-none');
  APP.canvas.classList.remove('d-block');
  APP.status.classList.remove('d-none'); // Show "Processing" or similar if we have it, or just keep it hidden until predict starts

  // Only run prediction if the model is ready
  if (APP.model) {
    console.log("Model execution starting...");
    setTimeout(() => { predict(APP.source) }, 50);
  } else {
    console.log("Model not ready yet. Prediction will run when model finishes loading.");
  }
}

const runModel = async () => {
  try {
    console.log("Loading model...");
    APP.model = await tf.loadGraphModel(APP.path)
    console.log("Model loaded.");

    // warm up
    APP.model.predict(tf.zeros([1, 1, 1, 3])).dispose()

    // If user already uploaded an image while we were loading, run prediction now
    if (APP.source.src && APP.source.src !== "" && window.getComputedStyle(APP.source).display !== 'none') {
      console.log("Image already present, running deferred prediction.");
      predict(APP.source);
    }

  } catch (e) {
    console.error("Failed to load model", e);
    alert("Failed to load model: " + e.message);
  }
}

async function predict(imgElement) {
  let img = tf.browser.fromPixels(imgElement)
  const shape = img.shape
  const [w, h] = shape
  img = normalize(img)
  const t0 = performance.now()
  const result = await APP.model.predict({ 'input_photo:0': img })
  const timer = performance.now() - t0
  let img_out = await result.squeeze().sub(tf.scalar(-1)).div(tf.scalar(2)).clipByValue(0, 1)
  const pad = Math.round(Math.abs(w - h) / Math.max(w, h) * APP.size)
  const slice = (w > h) ? [0, pad, 0] : [pad, 0, 0]
  img_out = img_out.slice(slice)
  draw(img_out, shape)
  console.log(Math.round(timer / 1000 * 10) / 10)
}

function normalize(img) {
  const [w, h] = img.shape
  // pad
  const pad = (w > h) ? [[0, 0], [w - h, 0], [0, 0]] : [[h - w, 0], [0, 0], [0, 0]]
  img = img.pad(pad)
  const size = APP.size
  img = tf.image.resizeBilinear(img, [size, size]).reshape([1, size, size, 3])
  const offset = tf.scalar(127.5)
  return img.sub(offset).div(offset)
}

function draw(img, size) {
  const scaleby = size[0] / img.shape[0]
  tf.browser.toPixels(img, APP.canvas)
  APP.canvas.classList.remove('d-none')
  APP.canvas.classList.add('d-block')
  APP.status.classList.add('d-none')
  setTimeout(() => scaleCanvas(scaleby))
}

function scaleCanvas(pct = 2) {
  const canvas = APP.$('result')
  const tmpcan = document.createElement('canvas')
  const tctx = tmpcan.getContext('2d')
  const cw = canvas.width
  const ch = canvas.height
  tmpcan.width = cw
  tmpcan.height = ch
  tctx.drawImage(canvas, 0, 0)
  canvas.width *= pct
  canvas.height *= pct
  const ctx = canvas.getContext('2d')
  ctx.drawImage(tmpcan, 0, 0, cw, ch, 0, 0, cw * pct, ch * pct)
  APP.download.href = canvas.toDataURL('image/jpeg')
}

document.getElementById('file').addEventListener('change', evt => {
  console.log("File input changed");
  // alert("File input changed!"); // Verify listener is attached
  evt.target.files.forEach(f => {
    console.log("Processing file:", f.name, "Type:", f.type);

    // Check if type is image
    if (!f.type.match('image.*')) {
      console.error("File is not recognized as an image:", f.type);
      alert("Error: File is not recognized as an image. Type detected: " + f.type);
      return;
    }

    let reader = new FileReader()
    reader.onload = e => {
      console.log("FileReader loaded data");
      APP.source.src = e.target.result;
      APP.source.onload(); // Manually trigger onload just in case, though assigning src usually does it
    }
    reader.onerror = e => {
      console.error("FileReader error:", e);
      alert("Error reading file");
    }
    reader.readAsDataURL(f)
  })
  evt.target.value = null
})

document.querySelectorAll('#examples img').forEach(
  img => img.addEventListener('click', evt => { APP.source.src = img.src })
)
