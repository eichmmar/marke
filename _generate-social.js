// Generates social media PNGs for each Abteilung via Playwright.
// Run: node _generate-social.js
// Output: downloads/abteilungen/social/<slug>.png

const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = __dirname;
const OUT  = path.join(ROOT, 'downloads', 'abteilungen', 'social');
fs.mkdirSync(OUT, { recursive: true });

const ABTEILUNGEN = [
  { slug: 'albis',                   line1: 'Albis' },
  { slug: 'ausserschwyz',            line1: 'Ausser',     line2: 'schwyz' },
  { slug: 'basel',                   line1: 'Basel' },
  { slug: 'chur',                    line1: 'Chur' },
  { slug: 'fuerstenland',            line1: 'Fürsten',    line2: 'land' },
  { slug: 'glarnerland',             line1: 'Glarner',    line2: 'land' },
  { slug: 'luzern',                  line1: 'Luzern' },
  { slug: 'nordwest-schweiz',        line1: 'Nordwest',   line2: 'Schweiz' },
  { slug: 'rapperswil-jona',         line1: 'Rapperswil', line2: 'Jona' },
  { slug: 'saanenland',              line1: 'Saanen',     line2: 'land' },
  { slug: 'samstagern-richterswil',  line1: 'Samstagern', line2: 'Richterswil' },
  { slug: 'schaffhausen',            line1: 'Schaff',     line2: 'hausen' },
  { slug: 'st-gallen',               line1: 'St. Gallen' },
  { slug: 'st-galler-oberland',      line1: 'St. Galler', line2: 'Oberland' },
  { slug: 'thurgau',                 line1: 'Thurgau' },
  { slug: 'winterthur',              line1: 'Winter',     line2: 'thur' },
  { slug: 'zuerich-oberland',        line1: 'Zürcher',    line2: 'Oberland' },
  { slug: 'zuerich-unterland',       line1: 'Zürcher',    line2: 'Unterland' },
  { slug: 'zuerichsee',              line1: 'Zürichsee' },
  { slug: 'zug',                     line1: 'Zug' },
];

function html(line1, line2) {
  const nameHtml = line2
    ? `<div class="name">${line1}<br>${line2}</div>`
    : `<div class="name">${line1}</div>`;
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @font-face {
    font-family: 'Fakt';
    src: url('/assets/fonts/FaktBold.ttf') format('truetype');
    font-weight: 700;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1080px; height: 1080px; overflow: hidden; }
  body {
    background: #2F5D77;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 64px;
    font-family: 'Fakt', 'Arial Black', sans-serif;
  }
  .logo { width: 580px; height: auto; }
  .name {
    font-family: 'Fakt', 'Arial Black', sans-serif;
    font-weight: 700;
    font-size: 128px;
    color: white;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    text-align: center;
    line-height: 1.05;
    padding: 0 40px;
  }
</style>
</head>
<body>
  <img class="logo" src="/assets/logos/Verkehrskadetten_Bildmarke_RGB_orange+weiss-cropped.svg" alt="">
  ${nameHtml}
</body>
</html>`;
}

// Simple static file server
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/card') {
    const line1 = url.searchParams.get('line1') || '';
    const line2 = url.searchParams.get('line2') || '';
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html(line1, line2));
    return;
  }
  // Serve static files
  let filePath = path.join(ROOT, url.pathname);
  if (!fs.existsSync(filePath)) { res.writeHead(404); res.end(); return; }
  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) { res.writeHead(403); res.end(); return; }
  const ext = path.extname(filePath).toLowerCase();
  const mime = { '.svg': 'image/svg+xml', '.ttf': 'font/truetype', '.otf': 'font/opentype', '.png': 'image/png' }[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime });
  fs.createReadStream(filePath).pipe(res);
});

(async () => {
  await new Promise(r => server.listen(8091, r));
  console.log('Server on :8091');

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1080 });

  for (const abt of ABTEILUNGEN) {
    const l2 = abt.line2 ? `&line2=${encodeURIComponent(abt.line2)}` : '';
    await page.goto(`http://localhost:8091/card?line1=${encodeURIComponent(abt.line1)}${l2}`);
    await page.waitForLoadState('networkidle');
    const out = path.join(OUT, `${abt.slug}.png`);
    await page.screenshot({ path: out, type: 'png' });
    console.log(`✓ ${abt.slug}.png`);
  }

  await browser.close();
  server.close();
  console.log(`\nDone — ${ABTEILUNGEN.length} PNGs in downloads/abteilungen/social/`);
})();
