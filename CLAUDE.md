# Markenportal Verkehrskadetten

Statisches Brand-Manual-Portal für die Dachmarke «Verkehrskadetten».  
**URL:** marke.vka-albis.ch | **Betrieben von:** VK Albis

## Tech Stack

- Plain HTML5 + CSS3 + Vanilla JS — kein Framework, kein Build-Step
- Font: Fakt (OurType) — Bold 700, Normal 400 — Dateien in `assets/fonts/`
- Deploy: `git push origin main` → cyon SSH (s078.cyon.net, User: vkaalbis)

## Dateistruktur

```
index.html               ← Gesamte Seite (single scrolling page)
crop-svg.py              ← Tool: SVG-Whitespace entfernen (viewBox anpassen)
assets/
  css/style.css          ← Alle Styles, CSS Custom Properties am Anfang
  js/main.js             ← Sticky nav (IntersectionObserver) + Farb-Clipboard
  fonts/                 ← FaktBold.ttf, FaktNormal.ttf/.otf
  logos/                 ← Dachmarken-SVGs (viewBox auf Inhalt gercroppt)
  logos/abteilungen/     ← Abteilungslogos (viewBox auf Inhalt gercroppt)
  social-media-preview.png ← OG-Image
downloads/               ← Downloadbare Assets (ZIPs + PDFs)
Ressourcen/              ← Quelldateien (nicht im Git, nicht auf Server)
```

## Sektionen in index.html

| ID | Inhalt |
|---|---|
| `#marke` | Markenidentität — 3 Karten: Wofür / Wie / Was verbindet |
| `#logo` | Logo-System — Dachmarke SVGs + Abteilungslogos |
| `#farben` | Farbpalette — 4 Kacheln, Klick kopiert HEX in Clipboard |
| `#typografie` | Fakt Bold/Normal + Schriftgrössentabelle |
| `#bildsprache` | Bildwelt — Kriterien-Chips + Gut/Schlecht-Beispiele + Dos&Don'ts |
| `#downloads` | Brand Assets — 6 Download-Karten |

## Marke

- **Primärfarbe:** `#ff6300` (VK Orange)
- **Schwarz:** `#1a1a1a` | **Blau (Accent):** `#2F5D77` | **Background:** `#f8f8f8`
- **Schrift:** Fakt Bold für Headlines, Normal für Fliesstext
- **Sprache:** Deutsch — immer «Uniform», nie «Weste»
- **Ton:** Klar, direkt, professionell — «Reduce to the max»

## Lokale Entwicklung

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

## Deploy

```bash
git add . && git commit -m "Beschreibung" && git push origin main
```

Remote `origin` → `ssh://vkaalbis@s078.cyon.net/home/vkaalbis/repos/marke.git`  
Post-receive Hook deployt nach `~/public_html/marke/`

## Downloads

Verfügbare Dateien in `downloads/`. Nicht verfügbare Buttons tragen `class="dl-btn unavailable"` → `class="dl-btn"` sobald bereit.

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

## SVG-Whitespace entfernen

```bash
python3 crop-svg.py assets/logos/neues-logo.svg
# oder alle auf einmal:
python3 crop-svg.py
```

Berechnet die exakte Bounding-Box aller Pfade und setzt den viewBox entsprechend (+ 2px Padding). Benötigt `svgpathtools` (`pip3 install svgpathtools`).
