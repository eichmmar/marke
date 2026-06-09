# Setup & Deploy

## Fonts

Bereits kopiert nach `assets/fonts/`:
- `FaktBold.ttf` — Überschriften (700)
- `FaktNormal.ttf` / `FaktNormal.otf` — Fliesstext (400)

## Downloads

| Datei | Status |
|---|---|
| `logos-dachmarke.zip` | ✅ vorhanden |
| `logos-abteilungen.zip` | ✅ vorhanden |
| `illustrator.zip` | ✅ vorhanden |
| `farbpalette.ase` | ✅ vorhanden |
| `social-media.zip` | ✅ vorhanden |
| `fakt-schriften.zip` | ✅ vorhanden |
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
- **E-Mail:** 2× in `index.html` suchen nach `marke-vk@vka-albis.ch`
