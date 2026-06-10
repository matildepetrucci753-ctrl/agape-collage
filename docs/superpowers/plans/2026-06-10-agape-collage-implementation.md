# Agape Collage — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the collage generator with logo, Arial font, all images, 6-8 count, and center-out radial composition.

**Architecture:** Single-page app with HTML/CSS/JS — modify 3 files.

**Tech Stack:** Vanilla JS, Canvas 2D, CSS

---

### Task 1: Add logo to sidebar

**Files:**
- Modify: `index.html:12`
- Modify: `style.css:45-51`

- [ ] **Step 1: Replace "AGAPE" title with logo image in index.html**

```html
<!-- old -->
<h1 class="title">Agape</h1>

<!-- new -->
<img class="logo" src="LOGO DEFINITIVO-1_page-0001.jpg" alt="Agape">
```

- [ ] **Step 2: Update CSS for logo styling**

Replace the `.title` block in `style.css`:

```css
.logo {
  display: block;
  width: 100%;
  max-width: 200px;
  height: auto;
}
```

- [ ] **Step 3: Verify layout**

Run: open `index.html` in a browser — the sidebar should show the logo instead of "AGAPE" text.

---

### Task 2: Change font to Arial

**Files:**
- Modify: `style.css:23`

- [ ] **Step 1: Update font-family in body**

```css
body {
  font-family: Arial, Helvetica, sans-serif;
}
```

- [ ] **Step 2: Verify**

Check that all sidebar text (labels, buttons, select) renders in Arial.

---

### Task 3: Update images and count in app.js

**Files:**
- Modify: `app.js:1-13`

- [ ] **Step 1: Replace IMAGE_FILES list with all images and update MIN/MAX**

```js
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
```

- [ ] **Step 2: Make image loading resilient to failures**

Replace the `loadAllImages` function:

```js
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
```

---

### Task 4: New center-out radial composition

**Files:**
- Modify: `app.js:88-127`

- [ ] **Step 1: Update `drawCollage` with progressive radial placement**

Replace the entire `drawCollage` function:

```js
function drawCollage() {
  const { width, height } = getFormat();
  canvas.width = width;
  canvas.height = height;
  resizeCanvasForDisplay(width, height);

  lastBg = pickRandom(PALETTE);
  ctx.fillStyle = lastBg;
  ctx.fillRect(0, 0, width, height);

  const pieces = pickCollageImages();
  const format = getFormat();
  const canvasMin = Math.min(width, height);
  const sizeByCount = 0.65 - (pieces.length - 4) * 0.04;
  const baseScale = canvasMin * sizeByCount * (format.sizeMultiplier ?? 1);

  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = Math.min(width, height) * 0.40;

  pieces.forEach((img, i) => {
    const scale = rand(0.85, 1.15) * (baseScale / Math.max(img.width, img.height));
    const w = img.width * scale;
    const h = img.height * scale;
    const rotation = rand(-30, 30) * (Math.PI / 180);

    const progress = pieces.length > 1 ? i / (pieces.length - 1) : 0;
    const radius = progress * maxRadius;
    const angle = rand(0, Math.PI * 2);

    const x = cx + Math.cos(angle) * radius - w / 2;
    const y = cy + Math.sin(angle) * radius - h / 2;

    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(rotation);
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
  });

  canvas.classList.remove("is-hidden");
  exportBtn.disabled = false;

  requestAnimationFrame(() => resizeCanvasForDisplay(width, height));
}
```

- [ ] **Step 2: Quick visual test**

Open `index.html` and click "Nuovo collage" a few times. Verify:
- Images radiate from center outward
- 6-8 images per collage
- First image near center, last near edges
- Overlap allowed
- Rotation looks natural
- Export works

---

### Task 5: Commit

- [ ] **Step 1: Commit all changes**

```bash
git add index.html style.css app.js
git commit -m "feat: logo, Arial, all images, 6-8 count, radial center-out composition"
```
