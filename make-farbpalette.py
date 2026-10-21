#!/usr/bin/env python3
"""Erzeugt downloads/farbpalette.ase — die Markenfarben als Adobe Swatch Exchange.

    python3 make-farbpalette.py

Vier globale Prozessfarben (CMYK) mit den Werten aus design-system.md. Die
Datei wird danach wieder eingelesen und zur Kontrolle ausgegeben.

ASE kennt pro Farbfeld genau ein Farbmodell — darum nur CMYK. HEX/RGB stehen
im Portal und in design-system.json.
"""

import os, struct

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'downloads/farbpalette.ase')

# Name, CMYK in Prozent — Quelle: downloads/design-system.md, Abschnitt «Farben»
FARBEN = [
    ('VK Orange',  (0, 75, 100, 0)),
    ('VK Blau',    (86, 57, 37, 15)),
    ('VK Schwarz', (0, 0, 0, 100)),
    ('VK Weiss',   (0, 0, 0, 0)),
]

BLOCK_COLOR = 0x0001
TYP = ('global', 'spot', 'normal')   # Farbtyp-Feld, 0 = global wie bisher


def color_block(name, cmyk):
    n = name + '\0'
    body = struct.pack('>H', len(n)) + n.encode('utf-16-be')
    body += b'CMYK' + struct.pack('>4f', *(v / 100 for v in cmyk))
    body += struct.pack('>H', 0)
    return struct.pack('>HI', BLOCK_COLOR, len(body)) + body


def write():
    data = b'ASEF' + struct.pack('>HHI', 1, 0, len(FARBEN))
    data += b''.join(color_block(n, c) for n, c in FARBEN)
    open(OUT, 'wb').write(data)
    os.chmod(OUT, 0o644)


def read(path):
    """[(name, modell, werte in %, typ)] — liest Farbblöcke, überspringt Gruppen."""
    d = open(path, 'rb').read()
    assert d[:4] == b'ASEF', 'keine ASE-Datei'
    count = struct.unpack('>I', d[8:12])[0]
    p, out = 12, []
    for _ in range(count):
        typ, length = struct.unpack('>HI', d[p:p + 6])
        b = d[p + 6:p + 6 + length]
        p += 6 + length
        if typ != BLOCK_COLOR:
            continue
        nl = struct.unpack('>H', b[:2])[0]
        name = b[2:2 + nl * 2].decode('utf-16-be').rstrip('\0')
        q = 2 + nl * 2
        model = b[q:q + 4].decode().strip()
        k = {'RGB': 3, 'CMYK': 4, 'Gray': 1, 'LAB': 3}[model]
        vals = struct.unpack('>%df' % k, b[q + 4:q + 4 + 4 * k])
        ct = struct.unpack('>H', b[q + 4 + 4 * k:q + 6 + 4 * k])[0]
        out.append((name, model, tuple(round(v * 100, 2) for v in vals), TYP[ct]))
    return out


if __name__ == '__main__':
    write()
    print(os.path.relpath(OUT, ROOT))
    for name, model, vals, typ in read(OUT):
        print('  %-11s %s %s (%s)' % (name, model, ' / '.join('%g' % v for v in vals), typ))
