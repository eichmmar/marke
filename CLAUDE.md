# Markenportal Verkehrskadetten

Statisches Brand-Manual-Portal für die Dachmarke «Verkehrskadetten».  
**URL:** marke.vka-albis.ch | **Betrieben von:** VK Albis

## Tech Stack

- Plain HTML5 + CSS3 + Vanilla JS — kein Framework, kein Build-Step
- Font: Fakt (OurType) — Bold 700, Normal 400 — Dateien in `assets/fonts/`
- Deploy: `git push origin main` → cyon SSH (s078.cyon.net, User: vkaalbis)

## Dateistruktur

```
index.html          ← Gesamte Seite (single scrolling page)
assets/
  css/style.css     ← Alle Styles, CSS Custom Properties am Anfang
  js/main.js        ← Sticky nav (IntersectionObserver) + Farb-Clipboard
  fonts/            ← FaktBold.ttf, FaktNormal.ttf/.otf
  logos/            ← SVGs aus Ressourcen/Verkehrskadetten_SVG_Dateien/
downloads/          ← Downloadbare Assets (ZIPs + PDFs)
Ressourcen/         ← Quelldateien (nicht im Git, nicht auf Server)
```

## Sektionen in index.html

| ID | Inhalt |
|---|---|
| `#marke` | Markenidentität — 3 Karten: Wofür / Wie / Was verbindet |
| `#logo` | Logo-System — Dachmarke SVGs + Familienmarken-Architektur |
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

## Downloads (noch ausstehend)

Dateien in `downloads/` ablegen, dann `class="dl-btn unavailable"` → `class="dl-btn"` in index.html:

| Datei | Quelle |
|---|---|
| `logos-svg.zip` | `Ressourcen/Verkehrskadetten_SVG_Dateien/` zippen |
| `logos-pdf-cmyk.zip` | `Ressourcen/Verkehrskadetten_PDF_Dateien/` zippen |
| `social-media.zip` | `Ressourcen/…/Verkehrskadetten_SocialMedia/` zippen |
| `illustrator.zip` | `Ressourcen/Verkehrskadetten_AdobeIllustrator_Dateien/` zippen |
| `farbpalette.ase` | Manuell aus Adobe exportieren |
