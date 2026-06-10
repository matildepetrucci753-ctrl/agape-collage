# Agape Collage — Specifica di Design

## Obiettivo
Aggiornare il generatore di collage Agape secondo le direttive del designer: logo nella sidebar, font Arial, uso di tutte le immagini, conteggio 6-8, composizione dal centro con raggio progressivo.

## Modifiche

### 1. Logo nella sidebar (sostituisce "AGAPE")
- Sostituire `<h1 class="title">Agape</h1>` in `index.html` con l'immagine `<img>`
- Usare il file `LOGO DEFINITIVO-1_page-0001.jpg` situato nella root del progetto
- Larghezza massima adattata alla sidebar (`--sidebar-width: 260px`), altezza automatica
- Mantenere la classe `.title` o crearne una immagine-specifica

### 2. Font Arial Regular
- Cambiare `font-family` nel CSS da `system-ui, -apple-system, "Segoe UI", sans-serif` a `Arial, sans-serif`
- Applicato a `body` (ereditato da tutti gli elementi)

### 3. Tutte le immagini nella cartella `immagini/`
- Caricare TUTTI i file immagine presenti in `immagini/` (nessuna esclusione — tutti sono immagini da collage)
- Attualmente ci sono ~45 file nella cartella
- Il caricamento usa `loadAllImages()` che attualmente punta a `IMAGE_FILES` — sostituire con un array generato
- Le immagini che non si caricano vengono saltate senza bloccare tutto il resto

### 4. Dinamica "più immagini = più piccole"
- Già implementato parzialmente, aggiornare la formula `sizeByCount` per 6-8 immagini
- `sizeByCount = 0.65 - (pieces.length - 4) * 0.05` (valore da tarare)
- `baseScale` moltiplicato per `sizeMultiplier` del formato

### 5. Da 4-6 a 6-8 immagini per collage
- `MIN_IMAGES = 6`
- `MAX_IMAGES = 8`

### 6. Composizione dal centro con raggio progressivo (Approccio 3)
- Per ogni immagine (in ordine), calcolare:
  - Angolo: `rand(0, 2π)` — completamente casuale
  - Distanza dal centro: progressiva in base all'indice
    - `progress = index / (pieces.length - 1)` da 0 a 1
    - `radius = progress * maxRadius` dove `maxRadius` è circa il 40-50% della dimensione minima del canvas
  - Posizione: `x = centerX + cos(angle) * radius - w/2`
  - Posizione: `y = centerY + sin(angle) * radius - h/2`
- Sovrapposizione permessa
- Rotazione casuale mantenuta (come già implementata)

### 7. Invariato
- Palette colori (`PALETTE`)
- Formati (square, portrait, landscape, stories)
- Pulsanti (Nuovo collage, Scarica)
- Stili generali di layout (sidebar + canvas)

## Dipendenze
- Logo file: `LOGO DEFINITIVO-1_page-0001.jpg` (esistente nella root)
- Immagini: tutti i file in `immagini/` con estensione `.png` o `.jpg`

## File da modificare
- `index.html` — sostituire titolo con logo
- `style.css` — cambiare font-family, eventualmente stili per il logo
- `app.js` — aggiungere immagini, aggiornare contaaggio, nuova logica di composizione
