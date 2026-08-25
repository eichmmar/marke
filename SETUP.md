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

## Abteilungslogo erzeugen

```bash
python3 make-abteilungslogo.py bern BERN                    # einzeilig
python3 make-abteilungslogo.py basel KADETTEN "KORPS BASEL" # zweizeilig
```

Schreibt 4 SVG (`assets/logos/abteilungen/`), 4 PDF (`downloads/abteilungen/`) und
das ZIP (`downloads/logos-abteilungen/`). Benötigt:
```bash
pip3 install fonttools svgpathtools
npm install && npx playwright install chromium
```

Danach die Abteilung an fünf Stellen nachtragen — siehe `CLAUDE.md`, Abschnitt
«Neue Abteilung hinzufügen». Satzparameter und Begründung stehen dort ebenfalls;
die Wortmarke wird mit Chromium gekernt, darum ist Playwright zwingend.

**ZIPs nach Asset-Änderungen neu bauen.** Die ZIPs sind Kopien — ändert man SVGs
oder PDFs, werden sie sonst still veraltet (genau das war bis August 2026 der
Fall: die ZIPs enthielten die Vor-Crop-SVGs):

```bash
# ein ZIP je Abteilung
for z in downloads/logos-abteilungen/*.zip; do id=$(basename "$z" .zip)
  d=$(mktemp -d); cp assets/logos/abteilungen/${id}_*.svg downloads/abteilungen/${id}_*.pdf "$d"/
  (cd "$d" && zip -q -X out.zip *.svg *.pdf) && cp "$d/out.zip" "$z"; rm -rf "$d"
done
# Sammel-ZIP
d=$(mktemp -d); cp assets/logos/abteilungen/*.svg downloads/abteilungen/*.pdf "$d"/
(cd "$d" && zip -q -X out.zip *.svg *.pdf) && cp "$d/out.zip" downloads/logos-abteilungen.zip; rm -rf "$d"
```

Gegenprobe: `unzip -p <zip> <datei>` muss byte-gleich zur ausgelieferten Datei sein.

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

Die Vorschau in der Logo-Sektion ist **kreisförmig** beschnitten (`.logo-preview.bg-blue`).
Lange zweite Zeilen ragen sonst aus dem Kreis — dann `line2LetterSpacing` setzen
(`basel`: `-0.06em`, `samstagern-richterswil`: `-0.1em`).

**Wenn `chromium.launch()` scheitert** («Executable doesn't exist at …
chromium_headless_shell-****»), wurde Playwright aktualisiert, ohne die Browser
nachzuziehen: `npx playwright install chromium`. Achtung — ein anderer
Chromium-Build rendert die Karten minimal anders (Antialiasing); das Skript
schreibt immer **alle** PNGs, darum hinterher die nicht betroffenen zurücksetzen,
sonst stehen unnötige Binär-Diffs im Commit.

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
- **E-Mail:** 2× in `index.html` suchen nach `marke@verkehrskadetten.ch`
