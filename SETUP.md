# Setup & Deploy

## Fonts

Hausschrift **Inter** (SIL OFL) wird im Web über das **rsms.me CDN** geladen — kein
Self-Hosting. Im `<head>` von `index.html`:
```html
<link rel="preconnect" href="https://rsms.me/">
<link rel="stylesheet" href="https://rsms.me/inter/inter.css">
```
CSS: `font-family: Inter` bzw. `InterVariable` (Variable Font, wenn unterstützt).
Schnitte: Light 300 / Regular 400 / Bold 700 + Italic. Desktop-Fonts für Print/Office
liegen in `downloads/inter.zip`.

Logo-Schrift **Fakt** (nur Logo/Social-Preview) in `assets/fonts/`:
- `FaktBold.ttf`, `FaktNormal.ttf`, `FaktNormal.otf`

## Downloads

| Datei | Status |
|---|---|
| `logos-dachmarke.zip` | ✅ vorhanden |
| `logos-abteilungen.zip` | ✅ vorhanden |
| `illustrator.zip` | ✅ vorhanden |
| `farbpalette.ase` | ✅ vorhanden |
| `social-media.zip` | ✅ vorhanden |
| `inter.zip` | ✅ vorhanden |
| `web-guidelines.pdf` | ✅ vorhanden |
| `logos-pdf-cmyk.zip` | ausstehend — `Ressourcen/Verkehrskadetten_PDF_Dateien/` zippen |
| `design-system.json` | ✅ vorhanden |
| `design-system.md` | ✅ vorhanden |
| `favicons.zip` | ✅ vorhanden |

Fehlende Buttons tragen `class="dl-btn unavailable"` in `index.html` → auf `class="dl-btn"` ändern sobald Datei bereit.

## SVG-Whitespace entfernen

```bash
# Einzelne Datei
python3 crop-svg.py assets/logos/neues-logo.svg

# Alle Logos auf einmal
python3 crop-svg.py
```

Benötigt `svgpathtools`:
```bash
pip3 install svgpathtools
```

## Social-Media-PNGs generieren

```bash
node _generate-social.js
# → downloads/abteilungen/social/<slug>.png  (1080×1080 px je Abteilung)
```

Benötigt Playwright:
```bash
npm install
npx playwright install chromium
```

Abteilungsnamen und optionale Overrides (`fontSize`, `line2LetterSpacing`) in `_generate-social.js` → `ABTEILUNGEN`-Array anpassen.

## Lokal testen

```bash
# Mit lokalem Server (empfohlen — Fonts laden korrekt)
cd /Users/mark/sites/verkehrskadetten.ch/marke
python3 -m http.server 8080
# → http://localhost:8080
```

## Inhalte pflegen

- **Texte:** `index.html` direkt bearbeiten
- **Farben/Spacing:** CSS Custom Properties am Anfang von `assets/css/style.css`
- **Neue Logo-Variante:** `.logo-card` Block in Section 02 kopieren + anpassen
- **E-Mail:** 2× in `index.html` suchen nach `marke@svkv.ch`
