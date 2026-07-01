# Markenportal Verkehrskadetten

Statisches Brand-Manual-Portal für die Dachmarke «Verkehrskadetten».  
**URL:** marke.verkehrskadetten.ch | **Betrieben von:** VK Albis

## Tech Stack

- Plain HTML5 + CSS3 + Vanilla JS — kein Framework, kein Build-Step
- Font: Inter (SIL OFL) — Light 300 / Regular 400 / Bold 700 + Italic — im Web via rsms.me CDN (`inter.css`, kein Self-Hosting). Fakt (OurType) nur noch im Logo.
- Deploy: `git push origin main` → cyon SSH (s078.cyon.net, User: vkaalbis)

## Dateistruktur

```
index.html               ← Gesamte Seite (single scrolling page)
crop-svg.py              ← Tool: SVG-Whitespace entfernen (viewBox anpassen)
assets/
  css/style.css          ← Alle Styles, CSS Custom Properties am Anfang
  js/main.js             ← Sticky nav (IntersectionObserver) + Farb-Clipboard
  js/chat.js             ← Marken-Coach Chat-Widget (Frontend, spricht den Worker an)
  fonts/                 ← FaktBold/Normal (nur Logo/Social); Inter kommt via rsms.me CDN
  logos/                 ← Dachmarken-SVGs (viewBox auf Inhalt gercroppt)
  logos/abteilungen/     ← Abteilungslogos (viewBox auf Inhalt gercroppt)
  social-media-preview.png ← OG-Image
downloads/               ← Downloadbare Assets (ZIPs + PDFs)
worker/                  ← Cloudflare Worker: Proxy zur Anthropic-API (Marken-Coach)
Ressourcen/              ← Quelldateien (nicht im Git, nicht auf Server)
```

## Sektionen in index.html

| ID | Inhalt |
|---|---|
| `#marke` | Markenidentität — 3 Karten: Wofür / Wie / Was verbindet |
| `#logo` | Logo-System — Dachmarke SVGs + Abteilungslogos |
| `#farben` | Farbpalette — 4 Kacheln, Klick kopiert HEX in Clipboard |
| `#typografie` | Inter (Light/Regular/Bold + Italic) + Schriftgrössentabelle |
| `#bildsprache` | Bildwelt — Kriterien-Chips + Gut/Schlecht-Beispiele + Dos&Don'ts |
| `#downloads` | Brand Assets — Download-Karten |

## Marke

- **Primärfarbe:** `#ff6300` (VK Orange)
- **Schwarz:** `#1a1a1a` | **Blau (Accent):** `#2F5D77` | **Background:** `#f8f8f8`
- **Schrift:** Inter — Bold (Titel/Slogans), Regular (Fliesstext), Light (Claim), Italic punktuell; Fakt nur im Logo
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

## Marken-Coach (Chat-Agent)

Chat-Widget unten rechts, das Abteilungen hilft, das CI/CD umzusetzen (Fragen,
Texte, Checklisten, Asset-Lotse). Frontend: `assets/js/chat.js` + Markup/Styles
in `index.html`/`style.css`. Backend: Cloudflare Worker in `worker/` (hält den
Anthropic-API-Key, der **nie** im Browser stehen darf).

**Funktionsweise:** `chat.js` schickt `{messages, abteilung}` an den Worker →
Worker baut den System-Prompt (Wissensbasis = live geladene `design-system.md`,
gecacht via Prompt-Caching; Abteilung aus dem `abteilung`-Cookie) → ruft Claude
mit Streaming → reicht Text-Deltas als SSE an den Browser zurück.

**Modell:** `claude-sonnet-4-6` (in `worker/wrangler.toml` unter `[vars] MODEL`
änderbar — Alternativen `claude-haiku-4-5` / `claude-opus-4-8`).

**Worker-Setup / Deploy:**

```bash
cd worker
npm install
npx wrangler login                       # einmalig
npx wrangler secret put ANTHROPIC_API_KEY # API-Key eingeben (nicht committen)
npx wrangler deploy                       # gibt die Worker-URL aus
```

Nach dem Deploy die ausgegebene URL in `assets/js/chat.js` bei `WORKER_URL_PROD`
eintragen, dann Portal deployen.

**Lokal testen:** `cd worker && npx wrangler dev` (Port 8787) — `chat.js` zeigt auf
`localhost` automatisch dorthin. Portal parallel mit `python3 -m http.server 8080`.

**Wissensbasis:** Single Source of Truth ist `downloads/design-system.md` (wird vom
Worker zur Laufzeit geladen + 1 h gecacht). Bei Design-Änderungen reicht das
Portal-Deploy — der Worker muss **nicht** neu deployt werden.

## Downloads

Verfügbare Dateien in `downloads/`. Nicht verfügbare Buttons tragen `class="dl-btn unavailable"` → `class="dl-btn"` sobald bereit.

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

## SVG-Whitespace entfernen

```bash
python3 crop-svg.py assets/logos/neues-logo.svg
# oder alle auf einmal:
python3 crop-svg.py
```

Berechnet die exakte Bounding-Box aller Pfade und setzt den viewBox entsprechend (+ 2px Padding). Benötigt `svgpathtools` (`pip3 install svgpathtools`).
