# Setup & Deploy

## Fonts

Bereits kopiert nach `assets/fonts/`:
- `FaktBold.ttf` — Überschriften (700)
- `FaktNormal.ttf` / `FaktNormal.otf` — Fliesstext (400)

## Downloads vorbereiten

Folgende Dateien in `downloads/` ablegen:

| Datei | Quelle |
|---|---|
| `logos-svg.zip` | `Ressourcen/Verkehrskadetten_SVG_Dateien/` zippen |
| `logos-pdf-cmyk.zip` | `Ressourcen/Verkehrskadetten_PDF_Dateien/` zippen |
| `Verkehrskadetten_Marken-Manual.pdf` | ✅ bereits vorhanden |
| `social-media.zip` | `Ressourcen/…/Verkehrskadetten_SocialMedia/` zippen |
| `illustrator.zip` | `Ressourcen/Verkehrskadetten_AdobeIllustrator_Dateien/` zippen |
| `farbpalette.ase` | Manuell aus Adobe exportieren |

Bis die ZIPs bereit sind, zeigen die Buttons «Demnächst» — kein Fehler im Browser.

## Lokal testen

```bash
# Mit lokalem Server (empfohlen — Fonts laden korrekt)
cd /Users/mark/sites/vka-albis.ch/marke
python3 -m http.server 8080
# → http://localhost:8080
```

## Deploy auf cyon

1. Per FTP/SFTP alle Dateien ausser `Ressourcen/` und `.superpowers/` hochladen
2. Subdomain `marke.vka-albis.ch` auf cyon einrichten (falls noch nicht vorhanden)
3. Kein Build-Schritt — reine statische Dateien

## Inhalte pflegen

- **Texte:** `index.html` direkt bearbeiten
- **Farben/Spacing:** CSS Custom Properties am Anfang von `assets/css/style.css`
- **Neue Logo-Variante:** `.logo-card` Block in Section 02 kopieren + anpassen
- **E-Mail:** 2× in `index.html` suchen nach `mark.eichmann@vka-albis.ch`
