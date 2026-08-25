# Design System — Verkehrskadetten

**Version:** 1.0.0 · **Stand:** 2026-06-09  
**URL:** marke.verkehrskadetten.ch
**Kontakt:** marke@verkehrskadetten.ch

---

## Markenidentität

**Name:** Schweizerischer Verkehrskadetten Verband  
**Slogan:** Jugend bewegt Verkehr  
**Mission:** Jugend in Verantwortung. Sicherheit durch freiwilliges Engagement.

### Markenwerte

| Frage | Antwort |
|---|---|
| Wofür stehen wir? | Jugend in Verantwortung. Sicherheit durch freiwilliges Engagement. |
| Wie arbeiten wir? | Professionell ausgebildet, verlässlich im Einsatz, einheitlich im Auftritt. |
| Was verbindet uns? | Gemeinschaft, Disziplin — und die orange Uniform. |

### Tonalität

**Prinzip:** Reduce to the max

- Kurze, präzise Sätze · Aktive Sprache · Fakten vor Adjektiven
- Kein Marketingsprech, keine Übertreibungen, keine Mehrdeutigkeiten
- Immer **«Uniform»**, nie «Weste»

---

## Farben

| Token | Name | HEX | RGB | CMYK | Verwendung |
|---|---|---|---|---|---|
| `--orange` | VK Orange | `#FF6300` | 255 · 99 · 0 | 0 · 61 · 100 · 0 | Primärfarbe — CTAs, Akzente, aktive Zustände |
| `--black` | VK Schwarz | `#1A1A1A` | 26 · 26 · 26 | 0 · 0 · 0 · 93 | Headlines, Bodytext, Footer-Hintergrund |
| `--blue` | VK Blau | `#2F5D77` | 47 · 93 · 119 | 60 · 22 · 0 · 53 | Abteilungs-Bar, strukturelle Akzente |
| `--off-white` | VK Weiss | `#F8F8F8` | 248 · 248 · 248 | 0 · 0 · 0 · 2 | Karten- und Sektions-Hintergründe |

### Funktionale Farben

| Zweck | Wert |
|---|---|
| Border | `#eeeeee` |
| Text (gedämpft) | `#777777` |
| Erfolg | `#2d7a4f` / Hintergrund `#f0faf4` |
| Fehler | `#c0392b` / Hintergrund `#fef5f5` |
| Orange-Tint | `#fff4ee` (Tags, Icon-Hintergründe) |

### Farbregeln

- Seitengrund: `white` (#ffffff) · Karten/Sektionen: `#f8f8f8`
- **Keine Verläufe** (Gradients)
- Schatten nur auf interaktiven Hover-States

---

## Typografie

### Hausschrift: Inter

**Lizenz:** SIL Open Font License 1.1 — frei verwendbar (auch extern).  
**Web-Einbindung:** via rsms.me CDN (kein Self-Hosting). Im `<head>`: `<link rel="preconnect" href="https://rsms.me/">` + `<link rel="stylesheet" href="https://rsms.me/inter/inter.css">`. CSS nutzt `font-family: Inter` bzw. `InterVariable` (Variable Font, wenn unterstützt) — deckt alle Gewichte 100–900 + Italic ab.  
**Bezug:** gratis via https://rsms.me/inter/ oder Google Fonts; Download-Paket (OTF/TTF) unter `downloads/inter.zip`  
**CSS:** `font-family: 'Inter', system-ui, sans-serif;`

| Schnitt | Weight | Verwendung |
|---|---|---|
| Inter Bold | 700 | Schriftmarke, Titel, Slogans, Labels, CTAs, Navigation |
| Inter Regular | 400 | Fliesstext, Beschreibungen |
| Inter Light | 300 | Claim, ruhiger Fliesstext |
| Inter Italic | — | punktuell für Betonungen/Zitate, in allen Gewichten |

### Logo-Schrift: Fakt (OurType)

Fakt wird **ausschliesslich im Logo** verwendet. Die Schriftmarke ist in den
Logo-SVGs als Pfade hinterlegt — Fakt ist **nicht** für Text/Fliesstext einzusetzen.
Lizenz: OurType, intern. Dateien verbleiben unter `assets/fonts/FaktBold.ttf`,
`FaktNormal.ttf`, `FaktNormal.otf` (nur für Logo/Asset-Erstellung).

### Schriftgrössen-Skala

| Ebene | Grösse | Weight | Zeilenabstand | Besonderheiten |
|---|---|---|---|---|
| Display / H1 | 40–64 px | 700 | 1.0–1.1 | letter-spacing −0.025em |
| Headline / H2 | 24–32 px | 700 | 1.15 | — |
| Subheading / H3 | 16–20 px | 700 | 1.3 | — |
| Body Text | 14–16 px | 400 | 1.6–1.7 | max-width 580px |
| Caption / Label | 9–12 px | 700 | 1.4 | uppercase, letter-spacing 0.10–0.20em |

### Ersatzschriften

Falls Inter nicht verfügbar ist (z. B. E-Mail/Office ohne Installation):

| Kontext | Schrift | Quelle |
|---|---|---|
| E-Mail / Office | Calibri | System — ähnliche Proportionen |
| Universal | Arial / Helvetica | System — letzter Fallback |

---

## Spacing & Layout

### CSS Custom Properties

```css
--orange:      #ff6300
--black:       #1a1a1a
--blue:        #2F5D77
--off-white:   #f8f8f8
--border:      #eeeeee
--text-muted:  #777777
--max-w:       900px
--pad:         40px   /* 20px auf Mobile */
--section-gap: 64px   /* 48px auf Mobile */
```

### Maximale Inhaltsbreite

`900px` — zentriert mit `margin: 0 auto`

### Abstände (gebräuchliche Werte)

4 · 8 · 12 · 16 · 20 · 24 · 28 · 32 · 36 · 40 · 48 · 64 · 72 px

### Breakpoints

| Breakpoint | Änderungen |
|---|---|
| ≤ 768 px | Padding → 20px, Section-Gap → 48px, Hero 1-spaltig, Nav-Links ausgeblendet, Grids auf 1–2 Spalten |
| ≤ 480 px | Logo-Grid und Download-Grid → 1 Spalte |

### Border-Radius

| Stufe | Wert | Verwendung |
|---|---|---|
| small | 3 px | Select, Toast |
| medium | 4–5 px | Buttons, Tags |
| large | 8 px | Fallback-Cards |
| card | 10 px | Standard-Karten |
| pill | 20 px | Bildsprache-Chips |
| hero | 12 px | Hero Logo-Box |

---

## Logo-System

### Dachmarke

| Variante | Datei | Hintergrund |
|---|---|---|
| Kombination orange+schwarz *(Standard)* | `assets/logos/Verkehrskadetten_Kombination_RGB_orange+schwarz.svg` | hell |
| Kombination orange+weiss | `assets/logos/Verkehrskadetten_Kombination_RGB_orange+weiss.svg` | dunkel |
| Kombination outline+schwarz | `assets/logos/Verkehrskadetten_Kombination_RGB_outline+schwarz.svg` | hell |
| Kombination outline+weiss | `assets/logos/Verkehrskadetten_Kombination_RGB_outline+weiss.svg` | dunkel |
| Bildmarke orange+schwarz | `assets/logos/Verkehrskadetten_Bildmarke_RGB_orange+schwarz.svg` | hell |
| Bildmarke orange+weiss | `assets/logos/Verkehrskadetten_Bildmarke_RGB_orange+weiss.svg` | dunkel |
| Bildmarke outline+schwarz | `assets/logos/Verkehrskadetten_Bildmarke_RGB_outline+schwarz.svg` | hell |
| Bildmarke outline+weiss | `assets/logos/Verkehrskadetten_Bildmarke_RGB_outline+weiss.svg` | dunkel |
| Schriftmarke schwarz | `assets/logos/Verkehrskadetten_Schriftmarke_RGB_schwarz.svg` | hell |
| Schriftmarke weiss | `assets/logos/Verkehrskadetten_Schriftmarke_RGB_weiss.svg` | dunkel |

**Schutzraum:** Mindestabstand = Höhe des Logos rundum freilassen.

#### Logo-Regeln

✓ Nur freigegebene SVG- und PDF-Dateien verwenden  
✓ Ausreichend Schutzraum freilassen  
✓ Auf kontrastreichem Hintergrund platzieren  
✓ Proportionen beim Skalieren beibehalten  

✗ Logo verzerren, drehen oder neu einfärben  
✗ Elemente entfernen oder umordnen  
✗ Schatten, Verläufe oder Effekte hinzufügen  
✗ Eigene Varianten erstellen  

### Abteilungslogos

**Datei-Schema:** `assets/logos/abteilungen/{id}_{colorMode}_{farbe}.svg`  
**Varianten:** `RGB_schwarz`, `RGB_weiss`, `CMYK_schwarz`, `CMYK_weiss`

| ID | Abteilung |
|---|---|
| albis | VK Albis |
| ausserschwyz | VK Ausserschwyz |
| basel | VK Kadetten Korps Basel |
| bern | VK Bern |
| chur | VK Chur |
| fuerstenland | VK Fürstenland |
| glarnerland | VK Glarnerland |
| luzern | VK Luzern |
| nordwest-schweiz | VK Nordwest Schweiz |
| rapperswil-jona | VK Rapperswil-Jona |
| saanenland | VK Saanenland |
| samstagern-richterswil | VK Samstagern-Richterswil |
| schaffhausen | VK Schaffhausen |
| st-gallen | VK St. Gallen |
| st-galler-oberland | VK St. Galler Oberland |
| thurgau | VK Thurgau |
| winterthur | VK Winterthur |
| zuerich-oberland | VK Zürcher Oberland |
| zuerich-unterland | VK Zürcher Unterland |
| zuerichsee | VK Zürichsee |
| zug | VK Zug |

---

## Bildsprache

**Stil:** Authentische Fotografie — keine gestellten Stock-Bilder  
**Motive:** Jugendliche im echten Einsatz

### Kriterien

- Authentische Situationen · Sichtbare Verantwortung · Nähe zu den Menschen
- Teamgeist · Kompetenz & Professionalität

✓ Gesichter, Emotionen, echte Einsätze  
✗ Rückenansichten ohne Gesichtsbezug · Unklare Bildaussagen · Technisch schlechte Aufnahmen

---

## Komponenten

### Navigation

- Sticky, `z-index: 100`, Höhe 60 px, weisser Hintergrund
- Scrolled-State: `box-shadow 0 2px 16px rgba(0,0,0,0.08)`
- Links: 13 px, Bold, Farbe `#777` → `#ff6300` (hover/active) + 2 px orange Unterstrich
- Mobile (≤768 px): Links ausgeblendet

### Abteilungs-Bar

- Höhe 34 px, Hintergrund `#2F5D77`
- Dropdown-Auswahl speichert Abteilung als Cookie (365 Tage)
- Auswahl beeinflusst: Hero-Logo · Logo-Sektion · Download-Button

### Hero

- Desktop: 2-Spalten-Grid (`1fr 280px`), Mobile: 1-spaltig, Logo-Box ausgeblendet
- Titel: 56 px, Bold, `letter-spacing: -0.025em`
- Akzent-Span: `color: var(--orange)`

### Sektions-Struktur

```
.section-label   11px · Bold · Uppercase · Orange · letter-spacing 0.18em
.section-title   32px · Bold · Schwarz
.section-desc    15px · Normal · #777 · max-width 580px
```

### Karten (allgemein)

- Border: `1px solid #eee` · Radius: 10 px
- Hover: `border-color: var(--orange)` + leichter Schatten

### Farbkacheln

- Klick → HEX in Clipboard · Toast-Feedback «Kopiert!» (1.5 s)
- Hover: `translateY(-2px)`

### Download-Button

- Standard: `background: #1a1a1a` · Hover: `background: #ff6300`
- Nicht verfügbar: `background: #ccc`, `pointer-events: none`

### Dos & Don'ts

- Grün (`#f0faf4` / `#2d7a4f`) für erlaubte Verwendungen
- Rot (`#fef5f5` / `#c0392b`) für verbotene Verwendungen

---

## Tech Stack

```
Sprache:     Plain HTML5 + CSS3 + Vanilla JS
Framework:   keins
Build-Step:  keiner
Deploy:      git push origin main → SSH Post-receive Hook → ~/public_html/marke/
Server:      cyon (s078.cyon.net, User: vkaalbis)
Dev:         python3 -m http.server 8080
```

---

## Downloads

| Datei | Format | Inhalt |
|---|---|---|
| `downloads/logos-dachmarke.zip` | ZIP | SVG (RGB) + PDF (CMYK): alle Dachmarken-Varianten |
| `downloads/logos-abteilungen/{id}.zip` | ZIP | Logos je Abteilung (SVG + PDF) |
| `downloads/Verkehrskadetten_Marken-Manual.pdf` | PDF | Vollständiges Marken-Manual |
| `downloads/illustrator.zip` | ZIP | Original-.ai-Dateien für Druck |
| `downloads/farbpalette.ase` | ASE | Adobe Swatch Exchange (HEX, RGB, CMYK) |
| `downloads/web-guidelines.pdf` | PDF | Richtlinien für digitale Auftritte |
| `downloads/inter.zip` | ZIP | Inter OTF + TTF (Light/Regular/Bold + Italics), SIL OFL |
| `downloads/design-system.json` | JSON | Maschinenlesbares Design System |
| `downloads/design-system.md` | MD | Dieses Dokument |
| `downloads/favicons.zip` | ZIP | Favicon-Set: ICO, SVG, PNG 16–512 px, Apple Touch Icon |
