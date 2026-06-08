#!/usr/bin/env python3
"""Crop SVG files by computing the tight bounding box and updating the viewBox."""

import sys
import re
import glob
import os
from svgpathtools import svg2paths

PADDING = 2  # px padding around content


def get_tight_viewbox(svg_file):
    try:
        paths, _ = svg2paths(svg_file)
    except Exception as e:
        print(f"  Error parsing paths in {svg_file}: {e}", file=sys.stderr)
        return None

    if not paths:
        return None

    min_x = float('inf')
    min_y = float('inf')
    max_x = float('-inf')
    max_y = float('-inf')

    for path in paths:
        try:
            xmin, xmax, ymin, ymax = path.bbox()
            min_x = min(min_x, xmin)
            min_y = min(min_y, ymin)
            max_x = max(max_x, xmax)
            max_y = max(max_y, ymax)
        except Exception:
            pass

    if min_x == float('inf'):
        return None

    return (min_x - PADDING, min_y - PADDING,
            max_x - min_x + 2 * PADDING, max_y - min_y + 2 * PADDING)


def crop_svg(svg_file):
    box = get_tight_viewbox(svg_file)
    if box is None:
        print(f"  SKIP  {svg_file}")
        return

    x, y, w, h = box
    new_viewbox = f"{x:.2f} {y:.2f} {w:.2f} {h:.2f}"

    with open(svg_file, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = re.sub(r'viewBox="[^"]*"', f'viewBox="{new_viewbox}"', content, count=1)

    with open(svg_file, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"  OK    {os.path.basename(svg_file)}  →  viewBox={new_viewbox}")


if __name__ == '__main__':
    if len(sys.argv) > 1:
        files = sys.argv[1:]
    else:
        base = os.path.dirname(os.path.abspath(__file__))
        files = (
            glob.glob(os.path.join(base, 'assets/logos/*.svg')) +
            glob.glob(os.path.join(base, 'assets/logos/abteilungen/*.svg'))
        )

    for f in sorted(files):
        crop_svg(f)

    print("Done.")
