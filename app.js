const PALETTE = ["#dca8f8", "#fee5f9", "#943ba4", "#000070", "#d90424", "#ffd332"];

const IMAGE_FILES = [
  "immagini/364210ff4690231f930d2bba03d199a0.png",
  "immagini/6941a6ca8fa02674f20843af4f36cc2a.png",
  "immagini/8e8bf0645f3540c3af59611cf61fb8a4.png",
  "immagini/930af06d61cf852055c0bcc0a43d3cad.png",
  "immagini/bfg.png",
  "immagini/bg.png",
  "immagini/ChatGPT Image 2 giu 2026, 12_53_03.png",
  "immagini/ChatGPT Image 2 giu 2026, 13_03_55.png",
  "immagini/d.png",
  "immagini/dd.png",
  "immagini/ddddd.png",
  "immagini/decd64f48679d2fe1832a1509a2440e8.jpg",
  "immagini/dgr.png",
  "immagini/download (2).png",
  "immagini/download.png",
  "immagini/f5b6456b1e2f6d01c456756f1067638f.png",
  "immagini/fbdf.png",
  "immagini/fbfd.png",
  "immagini/fff.png",
  "immagini/fg.png",
  "immagini/gdv.png",
  "immagini/ggg.png",
  "immagini/ghtdf.png",
  "immagini/gsd.png",
  "immagini/gsf.png",
  "immagini/hfg.png",
  "immagini/hh.png",
  "immagini/hjhj.png",
  "immagini/hnhfb.png",
  "immagini/imm1.png",
  "immagini/imm2.png",
  "immagini/imm3.png",
  "immagini/imm4.png",
  "immagini/imm5.png",
  "immagini/imm6.png",
  "immagini/jtrfhfr.png",
  "immagini/kk.png",
  "immagini/nrb.png",
  "immagini/rbdfgv.png",
  "immagini/sacad.png",
  "immagini/tbhsf.png",
  "immagini/vcad.png",
  "immagini/vsf.png",
  "immagini/wef.png",
  "immagini/WhatsApp Image 2026-06-02 at 13.17.39.png",
];

const MIN_IMAGES = 6;
const MAX_IMAGES = 8;

const FORMATS = {
  square: { width: 1080, height: 1080, label: "quadrato", sizeMultiplier: 1 },
  portrait: { width: 1080, height: 1350, label: "verticale", sizeMultiplier: 2 },
  landscape: { width: 1920, height: 1080, label: "orizzontale", sizeMultiplier: 2 },
  stories: { width: 1080, height: 1920, label: "stories", sizeMultiplier: 2 },
};

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const formatSelect = document.getElementById("format");
const generateBtn = document.getElementById("generate");
const exportBtn = document.getElementById("export");
const radiusSlider = document.getElementById("radiusSlider");
const loadingEl = document.getElementById("loading");

let loadedImages = [];
let lastBg = "#ffffff";
let currentPieces = [];
let currentLayout = [];

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function randInt(min, max) {
  return Math.floor(rand(min, max + 1));
}

function pickRandom(arr) {
  return arr[randInt(0, arr.length - 1)];
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Impossibile caricare ${src}`));
    img.src = src;
  });
}

async function loadAllImages() {
  const results = await Promise.allSettled(IMAGE_FILES.map(loadImage));
  const loaded = results
    .filter(r => r.status === "fulfilled")
    .map(r => r.value);
  if (loaded.length < MIN_IMAGES) {
    throw new Error(`Caricate solo ${loaded.length} immagini su ${IMAGE_FILES.length}`);
  }
  return loaded;
}

function getFormat() {
  return FORMATS[formatSelect.value] ?? FORMATS.square;
}

function resizeCanvasForDisplay(width, height) {
  const wrap = canvas.parentElement;
  if (!wrap || !width || !height) return;

  const availW = wrap.clientWidth;
  const availH = wrap.clientHeight;
  const scale = Math.min(1, availW / width, availH / height);

  canvas.style.width = `${Math.round(width * scale)}px`;
  canvas.style.height = `${Math.round(height * scale)}px`;
}

function pickCollageImages() {
  const count = randInt(MIN_IMAGES, Math.min(MAX_IMAGES, loadedImages.length));
  return shuffle(loadedImages).slice(0, count);
}

function drawCollage() {
  const { width, height } = getFormat();
  canvas.width = width;
  canvas.height = height;
  resizeCanvasForDisplay(width, height);

  lastBg = pickRandom(PALETTE);
  currentPieces = pickCollageImages();
  const canvasMin = Math.min(width, height);

  const sizeByCount = 0.50 - (currentPieces.length - 6) * 0.06;
  const baseScale = canvasMin * sizeByCount;

  currentLayout = currentPieces.map((img, idx) => {
    const scale = rand(0.88, 1.00) * (baseScale / Math.max(img.width, img.height));
    const w = img.width * scale;
    const h = img.height * scale;
    const rotation = rand(-15, 15) * (Math.PI / 180);
    const slice = (Math.PI * 2) / currentPieces.length;
    const angle = slice * idx + rand(0, slice * 0.25);
    return { w, h, rotation, angle };
  });

  redraw();
}

function redraw() {
  const { width, height } = getFormat();
  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = lastBg;
  ctx.fillRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2;

  for (let idx = currentPieces.length - 1; idx >= 0; idx--) {
    const img = currentPieces[idx];
    const { w, h, rotation, angle } = currentLayout[idx];
    const radius = Math.max(w, h) * parseFloat(radiusSlider.value);

    const x = cx + Math.cos(angle) * radius - w / 2;
    const y = cy + Math.sin(angle) * radius - h / 2;

    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(rotation);
    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = 6;
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
  }

  canvas.classList.remove("is-hidden");
  exportBtn.disabled = false;

  requestAnimationFrame(() => resizeCanvasForDisplay(width, height));
}

function exportCollage() {
  const link = document.createElement("a");
  const { label } = getFormat();
  const stamp = new Date().toISOString().slice(0, 10);
  link.download = `agape-${label}-${stamp}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

async function init() {
  try {
    loadedImages = await loadAllImages();
    loadingEl.classList.add("is-hidden");
    generateBtn.disabled = false;
    drawCollage();
  } catch {
    loadingEl.textContent = "Errore nel caricamento delle immagini.";
  }
}

generateBtn.addEventListener("click", drawCollage);
exportBtn.addEventListener("click", exportCollage);
formatSelect.addEventListener("change", drawCollage);
radiusSlider.addEventListener("input", redraw);
function watchPosterSize() {
  const wrap = canvas.parentElement;
  if (!wrap || typeof ResizeObserver === "undefined") {
    window.addEventListener("resize", onPosterResize);
    return;
  }

  const observer = new ResizeObserver(onPosterResize);
  observer.observe(wrap);
}

function onPosterResize() {
  if (loadedImages.length && canvas.width) {
    resizeCanvasForDisplay(canvas.width, canvas.height);
  }
}

watchPosterSize();

generateBtn.disabled = true;
init();
