const PALETTE = ["#dca8f8", "#fee5f9", "#943ba4", "#000070", "#d90424", "#ffd332"];

const IMAGE_FILES = [
  "immagini/imm1.png",
  "immagini/imm2.png",
  "immagini/imm3.png",
  "immagini/imm4.png",
  "immagini/imm5.png",
  "immagini/imm6.png",
];

const MIN_IMAGES = 4;
const MAX_IMAGES = 6;

const FORMATS = {
  square: { width: 1080, height: 1080, label: "quadrato" },
  portrait: { width: 1080, height: 1350, label: "verticale" },
  landscape: { width: 1920, height: 1080, label: "orizzontale" },
  stories: { width: 1080, height: 1920, label: "stories" },
};

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const formatSelect = document.getElementById("format");
const generateBtn = document.getElementById("generate");
const exportBtn = document.getElementById("export");
const loadingEl = document.getElementById("loading");

let loadedImages = [];
let lastBg = "#ffffff";

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
  const results = await Promise.all(IMAGE_FILES.map(loadImage));
  return results;
}

function getFormat() {
  return FORMATS[formatSelect.value] ?? FORMATS.square;
}

function resizeCanvasForDisplay(width, height) {
  const maxDisplay = Math.min(720, window.innerWidth - 48);
  const scale = Math.min(1, maxDisplay / width);
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
  ctx.fillStyle = lastBg;
  ctx.fillRect(0, 0, width, height);

  const pieces = pickCollageImages();
  const canvasMin = Math.min(width, height);
  // Meno foto = più grandi; con 6 foto restano comunque ampie sulla tavola
  const sizeByCount = 0.58 - (pieces.length - 2) * 0.05;
  const baseScale = canvasMin * sizeByCount;

  pieces.forEach((img) => {
    const scale = rand(0.92, 1.12) * (baseScale / Math.max(img.width, img.height));
    const w = img.width * scale;
    const h = img.height * scale;
    const rotation = rand(-38, 38) * (Math.PI / 180);
    // Posizioni vicino al centro → più sovrapposizioni
    const spreadX = width * 0.28;
    const spreadY = height * 0.28;
    const x = width / 2 - w / 2 + rand(-spreadX, spreadX);
    const y = height / 2 - h / 2 + rand(-spreadY, spreadY);

    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(rotation);
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
  });

  canvas.classList.remove("is-hidden");
  exportBtn.disabled = false;
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
window.addEventListener("resize", () => {
  if (loadedImages.length) resizeCanvasForDisplay(canvas.width, canvas.height);
});

generateBtn.disabled = true;
init();
