# Markenportal Verkehrskadetten

Statisches Brand-Manual-Portal für die Dachmarke «Verkehrskadetten».  
**URL:** marke.verkehrskadetten.ch | **Betrieben von:** VK Albis

## Tech Stack

- Plain HTML5 + CSS3 + Vanilla JS — kein Framework, kein Build-Step
- Font: Inter (SIL OFL) — Light 300 / Regular 400 / Bold 700 + Italic — im Web via rsms.me CDN (`inter.css`, kein Self-Hosting). Fakt (OurType) nur noch im Logo.
- Deploy: FTP-Upload via `bash deploy.sh` (lftp mirror) — Zugang in `.env`

## Dateistruktur

```
index.html               ← Gesamte Seite (single scrolling page)
crop-svg.py              ← Tool: SVG-Whitespace entfernen (viewBox anpassen)
make-abteilungslogo.py   ← Tool: neues Abteilungslogo setzen (SVG + PDF + ZIP)
_generate-social.js      ← Tool: Social-Media-Karten 1080×1080 (Playwright)
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
- **Schwarz:** `#000000` | **Blau (Sekundär):** `#2F5D77` | **UI-Background:** `#f8f8f8`
- **Schrift:** Inter — Bold (Titel/Slogans), Regular (Fliesstext), Light (Claim), Italic punktuell; Fakt nur im Logo
- **Sprache:** Deutsch — immer «Uniform», nie «Weste»
- **Ton:** Klar, direkt, professionell — «Reduce to the max»
- **Claim:** «Jugend bewegt Verkehr»
- **Namen:** Die Marke heisst **Verkehrskadetten**. Träger ist der **Schweizerische
  Verkehrskadetten Verband (SVKV)** — dieser Name nur in rechtlichen Kontexten
  (Copyright, Impressum, Verträge), nicht in der Markenkommunikation.
- **Farbregel (Manual Kap. 8):** Primärfarbe vor allem für das «V» der Bildmarke,
  Sekundärfarbe ausschliesslich als Hintergrund, **Text nie in Primär- oder
  Sekundärfarbe**. Das Portal selbst weicht bewusst ab (orange Labels und Links) —
  dokumentiert in `downloads/design-system.md`.
- **Verbindliche Quelle:** `downloads/Verkehrskadetten_Marken-Manual.pdf`
  (Stand November 2025). Änderungen am Design nur mit Zustimmung von
  LOOKINGLATELY | Heimspiel (Urheberrecht).

## Lokale Entwicklung

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

## Deploy

Deployt wird per **FTP-Upload**, nicht über Git. Das Repository dient nur der
Versionierung — ein `git push` veröffentlicht nichts.

```bash
bash deploy.sh
```

In VS Code alternativ über die Task **«Deploy: FTP Upload»** (`.vscode/tasks.json`).

`deploy.sh` spiegelt das Arbeitsverzeichnis mit `lftp mirror --reverse --delete`
auf den Server. Die Zugangsdaten stehen in `.env` (nicht im Git) — Vorlage:
`.env.example` mit `FTP_HOST`, `FTP_USER`, `FTP_PASS`, `FTP_REMOTE_PATH`,
`FTP_PROTOCOL` (`ftp`, `sftp` oder `ftps`).

Wegen `--delete` gilt: Was lokal fehlt, wird auf dem Server gelöscht.

Hochgeladen wird nur das, was die Website tatsächlich braucht: `index.html`,
`assets/` und `downloads/`. Alles andere hält die Ausschlussliste im Skript
zurück — Quellen (`Ressourcen/`), Git- und Editor-Verzeichnisse, Zugangsdaten
(`.env`), die Agenten-Dokumentation (`CLAUDE.md`, `AGENTS.md`, `SETUP.md`,
`docs/`), die Build-Tools (`*.py`, `*.sh`, `_generate-social.js`), das
Node-Umfeld (`node_modules/`, `package*.json`), der separat deployte
Cloudflare-Worker (`worker/`) sowie lokale Artefakte (`ruvector.db`,
`agentdb.rvf*`, `__pycache__/`, `.DS_Store`).

Ausgeschlossene Dateien werden von `lftp` komplett ignoriert — `--delete`
entfernt sie also **nicht** vom Server, falls sie ein früherer Deploy
hochgeladen hat. Solche Altlasten einmalig von Hand löschen.

## Marken-Coach (Chat-Agent)

Chat-Widget unten rechts, das Abteilungen hilft, das CI/CD umzusetzen (Fragen,
Texte, Checklisten, Asset-Lotse). Frontend: `assets/js/chat.js` + Markup/Styles
in `index.html`/`style.css`. Backend: Cloudflare Worker in `worker/` (hält den
Anthropic-API-Key, der **nie** im Browser stehen darf).

**Funktionsweise:** `chat.js` schickt `{messages, abteilung}` an den Worker →
Worker baut den System-Prompt (Wissensbasis = live geladene `design-system.md`,
gecacht via Prompt-Caching; Abteilung aus dem `abteilung`-Cookie) → ruft Codex
mit Streaming → reicht Text-Deltas als SSE an den Browser zurück.

**Modell:** `Codex-sonnet-4-6` (in `worker/wrangler.toml` unter `[vars] MODEL`
änderbar — Alternativen `Codex-haiku-4-5` / `Codex-opus-4-8`).

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

## Neue Abteilung hinzufügen

```bash
python3 make-abteilungslogo.py bern BERN                    # einzeilig
python3 make-abteilungslogo.py basel KADETTEN "KORPS BASEL" # zweizeilig
```

Erzeugt 4 SVG + 4 PDF + das ZIP. Benötigt `pip3 install fonttools svgpathtools`
sowie `npm install` und `npx playwright install chromium`.

Danach die Abteilung an **fünf** Stellen von Hand nachtragen (die Liste ist
dupliziert, es gibt keine Single Source of Truth):

| Datei | Feld |
|---|---|
| `assets/js/main.js` | `ABTEILUNGEN` → `{ id, name }` |
| `worker/src/knowledge.js` | `ABTEILUNGEN` → `'id': 'Name'` (**Worker-Deploy nötig!**) |
| `_generate-social.js` | `ABTEILUNGEN` → `{ slug, line1, line2? }` |
| `downloads/design-system.md` | ID-Tabelle |
| `downloads/design-system.json` | `logos.abteilungen.list` |

Dann `node _generate-social.js` für die Social-Karte. Die Karten-Vorschau ist
kreisförmig beschnitten — lange zweite Zeilen brauchen ein
`line2LetterSpacing` (siehe `basel`, `samstagern-richterswil`).

### Farbräume der Downloads

| Variante | Farbraum | Werte |
|---|---|---|
| `*.svg` | RGB | Orange `#ff6300`, Schwarz `#000000` |
| `_RGB_*.pdf` | echtes **DeviceRGB** | dieselben Werte wie die SVGs |
| `_CMYK_*.pdf` | **DeviceCMYK** | Druckwerte des Designers, Orange `0/74.8/100/0` |

Alle digitalen Assets tragen ausschliesslich die Markenfarben. Drei bereinigte
Altlasten, die hier zusammenliefen:

- Die `_RGB_`-PDFs waren in Wahrheit CMYK — nur der Dateiname sagte RGB.
- Sie trugen drei verschiedene Orangetöne, teils zwischen Varianten derselben
  Abteilung.
- SVGs und PDFs benutzten die Rich-Black-Konversion `rgb(9.16%, …)` ≈ `#171817`
  statt des VK-Schwarz. **`#171817` darf nicht mehr vorkommen.**
- Das VK-Schwarz war danach `#1a1a1a`; das Marken-Manual (Nov. 2025, Kap. 8)
  definiert aber reines `#000000`. Seit dem Manual-Abgleich tragen alle SVGs und
  `_RGB_`-PDFs `#000000` — die Dachmarken-SVGs hatten das schon immer (kein
  `fill`-Attribut = SVG-Default `black`). **`#1a1a1a` darf nicht mehr vorkommen.**

Die CMYK-Dateien sind absichtlich unangetastet — sie tragen die Druckwerte des
Designers. Offen: die PDFs haben kein ICC-Profil und keinen OutputIntent,
Druckereien bekommen also unkalibriertes DeviceCMYK.

### Wie die Wortmarke gesetzt wird

Die Logos bestehen aus der immer gleichen Bildmarke plus einer Wortmarke, die als
Pfade vorliegt (kein `<text>`, keine Font-Abhängigkeit). Satzparameter, aus der
bestehenden Familie zurückgerechnet (Treffer ≤ 0.006 pt):

- Fakt Bold, Schriftgrad **39.789 pt** (Versalhöhe 27.375 pt), Laufweite 0
- Grundlinie der letzten Zeile **y = 107.496**, Pen-Ursprung **x = 208.503**
- Durchschuss mehrzeilig **1.0 em** — wie die dreizeilige Dachmarken-Schriftmarke
- Schwarz `#000000`, Orange `#ff6300` (siehe «Farbräume der Downloads»)

Die Wortmarken sind **gekernt**. Fakt Bold hat keine `kern`-Tabelle, nur GPOS —
darum shapet das Tool mit Chromium und liest die Pen-Positionen aus dem DOM.
Unkerntes Aneinanderreihen liegt bis 3.2 pt daneben.

## SVG-Whitespace entfernen

```bash
python3 crop-svg.py assets/logos/neues-logo.svg
# oder alle auf einmal:
python3 crop-svg.py
```

Berechnet die exakte Bounding-Box aller Pfade und setzt den viewBox entsprechend (+ 2px Padding). Benötigt `svgpathtools` (`pip3 install svgpathtools`).
