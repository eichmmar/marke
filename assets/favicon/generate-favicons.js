const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'favicon-source.svg');
const out = __dirname;

const sizes = [
  { name: 'favicon-16x16.png',           size: 16 },
  { name: 'favicon-32x32.png',           size: 32 },
  { name: 'favicon-48x48.png',           size: 48 },
  { name: 'apple-touch-icon.png',        size: 180 },
  { name: 'android-chrome-192x192.png',  size: 192 },
  { name: 'android-chrome-512x512.png',  size: 512 },
];

async function main() {
  const svgBuffer = fs.readFileSync(src);

  for (const { name, size } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(out, name));
    console.log(`ok ${name}`);
  }

  fs.copyFileSync(src, path.join(out, 'favicon.svg'));
  console.log('ok favicon.svg');

  console.log('\nDone. Run create-ico.py next.');
}

main().catch(err => { console.error(err); process.exit(1); });
