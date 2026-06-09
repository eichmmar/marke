"""Creates favicon.ico (16/32/48px) from the generated PNGs."""
from PIL import Image
import os

here = os.path.dirname(__file__)
sizes = [16, 32, 48]
imgs = [Image.open(os.path.join(here, f'favicon-{s}x{s}.png')) for s in sizes]
imgs[0].save(
    os.path.join(here, 'favicon.ico'),
    format='ICO',
    sizes=[(s, s) for s in sizes],
    append_images=imgs[1:]
)
print('ok favicon.ico')
