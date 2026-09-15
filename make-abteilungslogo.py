#!/usr/bin/env python3
"""Erzeugt ein Abteilungslogo (Bildmarke + Fakt-Bold-Wortmarke) passend zur Familie.

    python3 make-abteilungslogo.py bern BERN
    python3 make-abteilungslogo.py basel KADETTEN "KORPS BASEL"

Schreibt je Abteilung 4 SVG (assets/logos/abteilungen/), 4 PDF
(downloads/abteilungen/) und das ZIP (downloads/logos-abteilungen/).

Die Satzparameter unten sind aus den bestehenden Logos zurückgerechnet; die
Rekonstruktion trifft albis/basel/chur/luzern/zug auf <= 0.006 pt.

Wichtig: die Wortmarken sind GEKERNT. Fakt Bold hat keine 'kern'-Tabelle, nur
GPOS — deshalb wird Chromium als Shaper benutzt (getStartPositionOfChar an einem
SVG-<text>). Unkernte Vorschubbreiten liegen bis 3.2 pt daneben.

Benötigt: pip3 install fonttools svgpathtools · npm install · npx playwright install chromium
"""

import json, os, re, subprocess, sys, tempfile, zlib

ROOT = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(ROOT, 'assets/fonts/FaktBold.ttf')
TEMPLATE = os.path.join(ROOT, 'assets/logos/abteilungen/zug_RGB_schwarz.svg')

# ── Satzparameter (aus der bestehenden Familie vermessen) ────────────────────
UPEM, CAPU = 1000, 688          # Fakt Bold: units/em, capHeight
CAP        = 27.375             # Versalhöhe im Logo
SIZE       = CAP * UPEM / CAPU  # 39.7892 pt
BASE       = 107.496094         # Grundlinie der LETZTEN Zeile
X0         = 208.5030           # Pen-Ursprung (nicht die Tintenkante!)
LEAD       = SIZE               # Durchschuss 1.0 em (wie die Dachmarken-Schriftmarke)
HEIGHT     = 140.26             # Höhe der Bildmarke, in allen Logos gleich

BLACK_SVG  = '#000000'                                # VK-Schwarz
WHITE_SVG  = 'rgb(100%, 100%, 100%)'
ORANGE_SVG = '#ff6300'
# PDF-Farben. _CMYK_ trägt die Druckwerte des Designers, _RGB_ echtes
# DeviceRGB mit den exakten Markenwerten — die Dateinamen sagen also die
# Wahrheit (früher waren beide Varianten CMYK).
BLACK_K    = '0.744141 0.652344 0.621094 0.814453 k'
WHITE_K    = '0 0 0 0 k'
ORANGE_K   = '0.00466919 0.748047 1 0 k'
BLACK_RG   = '0 0 0 rg'                        # VK-Schwarz #000000
WHITE_RG   = '1 1 1 rg'
ORANGE_RG  = '1 0.388235 0 rg'                 # #ff6300 exakt

CLIP0 = ('<clipPath id="clip-0">\n<path clip-rule="nonzero" '
         'd="M 0 15 L 110 15 L 110 140.261719 L 0 140.261719 Z M 0 15 "/>\n</clipPath>')


# ── Kerning via Chromium ─────────────────────────────────────────────────────
def kerned_pens(words):
    """{wort: [pen-offset je Zeichen in em]} — Chromium/HarfBuzz als Shaper.

    Die Seite MUSS als file://-Dokument geladen werden: bei setContent() ist der
    Origin about:blank, die file://-URL der Schrift wird blockiert und Chromium
    fällt still auf eine Ersatzschrift zurück — die Wortmarke wäre dann falsch
    gesetzt (~0.4 % zu schmal). Darum unten der harte document.fonts.check().
    """
    html = '''<!doctype html><meta charset="utf-8">
<style>@font-face{font-family:'FK';src:url('file://%s') format('truetype');font-weight:700;font-style:normal}
body{margin:0}</style>
<svg xmlns="http://www.w3.org/2000/svg" width="4000" height="400" viewBox="0 0 4000 400">
<text id="t" x="0" y="300" font-family="FK" font-weight="700" font-size="1000"
      xml:space="preserve" style="letter-spacing:0">x</text></svg>''' % FONT
    fd, page = tempfile.mkstemp(suffix='.html', prefix='faktshape-')
    os.write(fd, html.encode()); os.close(fd)
    js = r'''
const {chromium}=require(%s);
const fs=require('fs'),os=require('os'),path=require('path');
function findChromium(){
  const base=path.join(os.homedir(),'Library/Caches/ms-playwright');
  if(!fs.existsSync(base)) return null;
  for(const d of fs.readdirSync(base).filter(x=>x.startsWith('chromium-')).sort().reverse()){
    for(const sub of ['chrome-mac-arm64','chrome-mac-x64']){
      const p=path.join(base,d,sub);
      if(!fs.existsSync(p)) continue;
      for(const app of fs.readdirSync(p).filter(x=>x.endsWith('.app'))){
        const exe=path.join(p,app,'Contents/MacOS',app.replace(/\.app$/,''));
        if(fs.existsSync(exe)) return exe;
      }
    }
  }
  return null;
}
(async()=>{
  let b;
  try { b = await chromium.launch(); }
  catch(e){ const exe=findChromium(); if(!exe) throw e; b=await chromium.launch({executablePath:exe}); }
  const p=await b.newPage();
  await p.goto('file://%s');
  await p.evaluate(()=>document.fonts.ready);
  const loaded=await p.evaluate(()=>document.fonts.check('700 1000px FK'));
  if(!loaded) throw new Error('Fakt Bold wurde nicht geladen — Messung waere falsch');
  const out={};
  for(const w of %s){
    out[w]=await p.evaluate(w=>{const t=document.getElementById('t');t.textContent=w;
      return [...w].map((_,i)=>t.getStartPositionOfChar(i).x/1000);}, w);
  }
  console.log(JSON.stringify(out));
  await b.close();
})();
''' % (json.dumps(os.path.join(ROOT, 'node_modules/playwright')),
       page, json.dumps(words))
    try:
        r = subprocess.run(['node', '-e', js], capture_output=True, text=True, cwd=ROOT)
    finally:
        os.unlink(page)
    if r.returncode:
        sys.exit('Chromium-Shaping fehlgeschlagen:\n' + (r.stderr or r.stdout))
    return json.loads(r.stdout.strip().splitlines()[-1])


# ── Glyph-Outlines via fontTools ─────────────────────────────────────────────
def _glyphset():
    from fontTools.ttLib import TTFont
    ft = TTFont(FONT)
    return ft.getGlyphSet(), ft.getBestCmap()


def glyph_svg_paths(word, pens, baseline):
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.transformPen import TransformPen
    from fontTools.misc.transform import Transform
    gs, cmap = _glyphset()
    out = []
    for ch, pen in zip(word, pens):
        if ch == ' ':
            continue
        sp = SVGPathPen(gs, ntos=lambda v: ('%.6f' % v).rstrip('0').rstrip('.'))
        t = Transform(SIZE / UPEM, 0, 0, -SIZE / UPEM, X0 + SIZE * pen, baseline)
        gs[cmap[ord(ch)]].draw(TransformPen(sp, t))
        d = sp.getCommands()
        if d.strip():
            out.append(d)
    return out


def glyph_contours(ch, pen, baseline):
    from fontTools.pens.recordingPen import RecordingPen
    from fontTools.pens.transformPen import TransformPen
    from fontTools.pens.qu2cuPen import Qu2CuPen
    from fontTools.misc.transform import Transform
    gs, cmap = _glyphset()
    rp = RecordingPen()
    t = Transform(SIZE / UPEM, 0, 0, -SIZE / UPEM, X0 + SIZE * pen, baseline)
    gs[cmap[ord(ch)]].draw(TransformPen(Qu2CuPen(rp, 0.001, all_cubic=True), t))
    contours, cur = [], []
    for op, args in rp.value:
        if op == 'moveTo':
            if cur:
                contours.append(cur)
            cur = [('m',) + args[0]]
        elif op == 'lineTo':
            cur.append(('l',) + args[0])
        elif op == 'curveTo':
            cur.append(('c',) + args[0] + args[1] + args[2])
        elif op == 'closePath' and cur:
            contours.append(cur); cur = []
    if cur:
        contours.append(cur)
    return contours


def ink_bbox(word, pens, baseline):
    from fontTools.pens.boundsPen import BoundsPen
    gs, cmap = _glyphset()
    xs, ys = [], []
    for ch, pen in zip(word, pens):
        if ch == ' ':
            continue
        bp = BoundsPen(gs); gs[cmap[ord(ch)]].draw(bp)
        if not bp.bounds:
            continue
        x0, y0, x1, y1 = bp.bounds
        xs += [X0 + SIZE * (pen + x0 / UPEM), X0 + SIZE * (pen + x1 / UPEM)]
        ys += [baseline - SIZE * y1 / UPEM, baseline - SIZE * y0 / UPEM]
    return min(xs), max(xs), min(ys), max(ys)


# ── Bildmarke (wortwörtlich aus einem bestehenden Logo) ──────────────────────
def bildmarke_svg(color):
    """Bildmarke aus dem Template, alle Nicht-Orange-Fills auf `color` gesetzt."""
    src = open(TEMPLATE).read()
    m = re.search(r'<path fill-rule="nonzero" fill="[^"]*"[^>]*d="M 180\.097656.*?</g>', src, re.S)
    block = m.group(0)
    # Orange bleibt immer Orange; alles andere ist die Schwarz/Weiss-Fläche.
    return re.sub(r'fill="((?!%s)[^"]*)"' % re.escape(ORANGE_SVG),
                  'fill="%s"' % color, block)


def bildmarke_ds():
    """die drei Bildmarken-Pfade: 2x schwarz, 1x orange"""
    ds = re.findall(r'\sd="([^"]*)"', open(TEMPLATE).read())
    return [ds[2], ds[3]], ds[4]      # ds[0], ds[1] sind die clipPaths


def parse_d(d):
    toks = d.replace(',', ' ').split()
    contours, cur, i = [], [], 0
    while i < len(toks):
        t = toks[i]
        if t == 'M':
            if cur:
                contours.append(cur)
            cur = [('m', float(toks[i + 1]), float(toks[i + 2]))]; i += 3
        elif t == 'L':
            cur.append(('l', float(toks[i + 1]), float(toks[i + 2]))); i += 3
        elif t == 'C':
            cur.append(('c',) + tuple(float(x) for x in toks[i + 1:i + 7])); i += 7
        elif t in 'Zz':
            i += 1
        else:
            raise ValueError('unbekannter Pfad-Operator %r' % t)
    if cur:
        contours.append(cur)
    return contours


# ── Ausgabe ─────────────────────────────────────────────────────────────────
def build_svg(lines, pens, color, width):
    paths = []
    n = len(lines)
    for i, txt in enumerate(lines):
        bl = BASE - (n - 1 - i) * LEAD
        for d in glyph_svg_paths(txt, pens[txt], bl):
            paths.append('<path fill-rule="nonzero" fill="%s" fill-opacity="1" d="%s"/>' % (color, d))
    head = ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            'width="%.2fpt" height="%.2fpt" viewBox="0 0 %.2f %.2f">\n<defs>\n%s\n</defs>\n'
            % (width, HEIGHT, width, HEIGHT, CLIP0))
    return head + bildmarke_svg(color) + '\n' + '\n'.join(paths) + '\n</svg>\n'


def build_pdf(lines, pens, black_op, orange_op, width):
    def emit(contours):
        s = []
        for c in contours:
            for seg in c:
                v = seg[1:]
                s.append(' '.join('%.4f' % (v[i] if i % 2 == 0 else HEIGHT - v[i])
                                  for i in range(len(v))) + ' ' + seg[0])
            s.append('h')
        return '\n'.join(s)

    blacks, orange = bildmarke_ds()
    body = [black_op]
    for d in blacks:
        body += [emit(parse_d(d)), 'f']
    body += [orange_op, emit(parse_d(orange)), 'f', black_op]
    n = len(lines)
    for i, txt in enumerate(lines):
        bl = BASE - (n - 1 - i) * LEAD
        for ch, pen in zip(txt, pens[txt]):
            if ch == ' ':
                continue
            body += [emit(glyph_contours(ch, pen, bl)), 'f']
    comp = zlib.compress('\n'.join(body).encode('latin-1'), 9)
    objs = [b'<< /Type /Catalog /Pages 2 0 R >>',
            b'<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
            ('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 %.2f %.2f] /Resources << >> '
             '/Contents 4 0 R >>' % (width, HEIGHT)).encode(),
            b'<< /Length %d /Filter /FlateDecode >>\nstream\n' % len(comp) + comp + b'\nendstream']
    out, offs = bytearray(b'%PDF-1.7\n%\xe2\xe3\xcf\xd3\n'), []
    for i, o in enumerate(objs, 1):
        offs.append(len(out))
        out += b'%d 0 obj\n' % i + o + b'\nendobj\n'
    xref = len(out)
    out += b'xref\n0 %d\n' % (len(objs) + 1) + b'0000000000 65535 f \n'
    for off in offs:
        out += b'%010d 00000 n \n' % off
    out += (b'trailer\n<< /Size %d /Root 1 0 R >>\nstartxref\n%d\n%%%%EOF\n'
            % (len(objs) + 1, xref))
    return bytes(out)


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    slug, lines = sys.argv[1], [l.upper() for l in sys.argv[2:]]
    pens = kerned_pens(lines)
    n = len(lines)
    width = round(max(ink_bbox(t, pens[t], BASE - (n - 1 - i) * LEAD)[1]
                      for i, t in enumerate(lines)), 2)

    svg_dir = os.path.join(ROOT, 'assets/logos/abteilungen')
    pdf_dir = os.path.join(ROOT, 'downloads/abteilungen')
    zip_dir = os.path.join(ROOT, 'downloads/logos-abteilungen')
    written = []
    for mode in ('RGB', 'CMYK'):
        orange_op = ORANGE_RG if mode == 'RGB' else ORANGE_K
        farben = (('schwarz', BLACK_SVG, BLACK_RG if mode == 'RGB' else BLACK_K),
                  ('weiss',   WHITE_SVG, WHITE_RG if mode == 'RGB' else WHITE_K))
        for farbe, csvg, ck in farben:
            p = os.path.join(svg_dir, '%s_%s_%s.svg' % (slug, mode, farbe))
            open(p, 'w').write(build_svg(lines, pens, csvg, width)); written.append(p)
            p = os.path.join(pdf_dir, '%s_%s_%s.pdf' % (slug, mode, farbe))
            open(p, 'wb').write(build_pdf(lines, pens, ck, orange_op, width)); written.append(p)
    for p in written:
        os.chmod(p, 0o644)

    subprocess.run([sys.executable, os.path.join(ROOT, 'crop-svg.py')]
                   + [p for p in written if p.endswith('.svg')], check=True)

    zip_path = os.path.join(zip_dir, '%s.zip' % slug)
    if os.path.exists(zip_path):
        os.remove(zip_path)
    with tempfile.TemporaryDirectory() as td:
        for p in written:
            open(os.path.join(td, os.path.basename(p)), 'wb').write(open(p, 'rb').read())
        subprocess.run('zip -q -X %s *.svg *.pdf' % zip_path, shell=True, cwd=td, check=True)
    os.chmod(zip_path, 0o644)

    print('\n%s: %d Zeile(n), Breite %.2f pt' % (slug, n, width))
    for p in written + [zip_path]:
        print('  %s' % os.path.relpath(p, ROOT))
    print('\nNoch von Hand: Eintrag in assets/js/main.js, worker/src/knowledge.js, '
          '_generate-social.js, downloads/design-system.{md,json} — dann '
          '`node _generate-social.js` für die Social-Karte.')


if __name__ == '__main__':
    main()
