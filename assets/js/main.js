// Sticky nav shadow on scroll
const nav = document.getElementById('site-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// Active nav link via IntersectionObserver
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });

sections.forEach(s => observer.observe(s));

// ── ABTEILUNG PICKER ──

const ABTEILUNGEN = [
  { id: 'albis',                  name: 'VK Albis' },
  { id: 'ausserschwyz',           name: 'VK Ausserschwyz' },
  { id: 'basel',                  name: 'VK Basel' },
  { id: 'chur',                   name: 'VK Chur' },
  { id: 'fuerstenland',           name: 'VK Fürstenland' },
  { id: 'glarnerland',            name: 'VK Glarnerland' },
  { id: 'luzern',                 name: 'VK Luzern' },
  { id: 'nordwest-schweiz',       name: 'VK Nordwest Schweiz' },
  { id: 'rapperswil-jona',        name: 'VK Rapperswil-Jona' },
  { id: 'saanenland',             name: 'VK Saanenland' },
  { id: 'samstagern-richterswil', name: 'VK Samstagern-Richterswil' },
  { id: 'schaffhausen',           name: 'VK Schaffhausen' },
  { id: 'st-gallen',              name: 'VK St. Gallen' },
  { id: 'st-galler-oberland',     name: 'VK St. Galler Oberland' },
  { id: 'thurgau',                name: 'VK Thurgau' },
  { id: 'winterthur',             name: 'VK Winterthur' },
  { id: 'zuerich-oberland',       name: 'VK Zürich Oberland' },
  { id: 'zuerich-unterland',      name: 'VK Zürich Unterland' },
  { id: 'zuerichsee',             name: 'VK Zürichsee' },
  { id: 'zug',                    name: 'VK Zug' },
].map(abt => ({
  ...abt,
  logos: [
    {
      src: `assets/logos/abteilungen/${abt.id}_RGB_schwarz.svg`,
      bg: 'bg-white',
      name: 'Kombination sw',
      downloads: [
        { label: 'SVG', href: `assets/logos/abteilungen/${abt.id}_RGB_schwarz.svg` },
        { label: 'PDF RGB', href: `downloads/abteilungen/${abt.id}_RGB_schwarz.pdf` },
        { label: 'PDF CMYK', href: `downloads/abteilungen/${abt.id}_CMYK_schwarz.pdf` },
      ]
    },
    {
      src: `assets/logos/abteilungen/${abt.id}_RGB_weiss.svg`,
      bg: 'bg-dark',
      name: 'Kombination weiss',
      downloads: [
        { label: 'SVG', href: `assets/logos/abteilungen/${abt.id}_RGB_weiss.svg` },
        { label: 'PDF RGB', href: `downloads/abteilungen/${abt.id}_RGB_weiss.pdf` },
        { label: 'PDF CMYK', href: `downloads/abteilungen/${abt.id}_CMYK_weiss.pdf` },
      ]
    },
    {
      src: `downloads/abteilungen/social/${abt.id}.png`,
      bg: 'bg-blue',
      name: 'Social Media',
      downloads: [
        { label: 'PNG', href: `downloads/abteilungen/social/${abt.id}.png` },
      ]
    }
  ]
}));

function setCookie(name, value, days) {
  document.cookie = `${name}=${encodeURIComponent(value)};max-age=${days * 86400};path=/;SameSite=Lax`;
}

function getCookie(name) {
  const m = document.cookie.split(';').find(c => c.trim().startsWith(name + '='));
  return m ? decodeURIComponent(m.trim().slice(name.length + 1)) : null;
}

function applyAbteilung(id) {
  const abt = ABTEILUNGEN.find(a => a.id === id) || null;

  const heroSlot = document.getElementById('hero-abt-slot');
  const heroImg = document.getElementById('hero-abt-img');
  if (abt) {
    heroImg.src = abt.logos[0].src;
    heroImg.alt = abt.name;
    heroSlot.style.display = 'flex';
  } else {
    heroSlot.style.display = 'none';
  }

  const section = document.getElementById('abt-logos-section');
  const heading = document.getElementById('abt-logos-heading');
  const grid = document.getElementById('abt-logos-grid');
  if (abt) {
    heading.textContent = `Abteilung: ${abt.name}`;
    grid.innerHTML = abt.logos.map(l => `
      <div class="logo-card">
        <div class="logo-preview ${l.bg}">
          <img src="${l.src}" alt="${l.name}">
        </div>
        <div class="logo-footer">
          <span class="logo-name">${l.name}</span>
          <span class="logo-dl-group">
            ${l.downloads.map(d => `<a href="${d.href}" download class="logo-dl">↓ ${d.label}</a>`).join('')}
          </span>
        </div>
      </div>`).join('');
    section.style.display = 'block';
  } else {
    section.style.display = 'none';
  }

  const dlName = document.getElementById('dl-abt-name');
  const dlDesc = document.getElementById('dl-abt-desc');
  const dlBtn  = document.getElementById('dl-abt-btn');
  if (abt) {
    dlName.textContent = `Logos ${abt.name}`;
    dlDesc.textContent = `Alle Logos der ${abt.name} — SVG und PDF (CMYK/RGB) als komplettes Paket.`;
    dlBtn.href = `downloads/logos-abteilungen/${abt.id}.zip`;
    dlBtn.setAttribute('download', '');
    dlBtn.textContent = '↓ ZIP';
    dlBtn.classList.remove('unavailable');
  } else {
    dlName.textContent = 'Logos Abteilungen';
    dlDesc.textContent = 'Wähle deine Abteilung im Header — der Download passt sich automatisch an.';
    dlBtn.removeAttribute('href');
    dlBtn.removeAttribute('download');
    dlBtn.textContent = 'Abteilung wählen';
    dlBtn.classList.add('unavailable');
  }
}

(function initAbtPicker() {
  const select = document.getElementById('abt-select');
  [{ id: '', name: 'Dachmarke' }, ...ABTEILUNGEN].forEach(abt => {
    const opt = document.createElement('option');
    opt.value = abt.id;
    opt.textContent = abt.name;
    select.appendChild(opt);
  });
  const saved = getCookie('abteilung') || '';
  select.value = saved;
  applyAbteilung(saved);
  select.addEventListener('change', () => {
    applyAbteilung(select.value);
    setCookie('abteilung', select.value, 365);
  });
})();

// Copy color hex to clipboard
function copyColor(card) {
  const hex = card.dataset.hex;
  if (!hex) return;

  const showToast = () => {
    const toast = card.querySelector('.color-toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1500);
  };

  if (navigator.clipboard) {
    navigator.clipboard.writeText(hex).then(showToast).catch(showToast);
  } else {
    const el = document.createElement('textarea');
    el.value = hex;
    el.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast();
  }
}
