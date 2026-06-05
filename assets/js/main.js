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
  {
    id: 'albis',
    name: 'VK Albis',
    logos: [
      { src: 'assets/logos/VK-Albis_Kombination_RGB_orange+schwarz-cropped.svg', bg: 'bg-white', name: 'Kombination sw', dl: 'assets/logos/VK-Albis_Kombination_RGB_orange+schwarz-cropped.svg' }
    ]
  }
];

function setCookie(name, value, days) {
  document.cookie = `${name}=${encodeURIComponent(value)};max-age=${days * 86400};path=/;SameSite=Lax`;
}

function getCookie(name) {
  const m = document.cookie.split(';').find(c => c.trim().startsWith(name + '='));
  return m ? decodeURIComponent(m.trim().slice(name.length + 1)) : null;
}

function applyAbteilung(id) {
  document.querySelectorAll('.abt-pill').forEach(p => p.classList.toggle('active', p.dataset.abt === id));

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
          <a href="${l.dl}" download class="logo-dl">↓ SVG</a>
        </div>
      </div>`).join('');
    section.style.display = 'block';
  } else {
    section.style.display = 'none';
  }
}

(function initAbtPicker() {
  const container = document.getElementById('abt-pills');
  [{ id: '', name: 'Dachmarke' }, ...ABTEILUNGEN].forEach(abt => {
    const btn = document.createElement('button');
    btn.className = 'abt-pill';
    btn.dataset.abt = abt.id;
    btn.textContent = abt.name;
    btn.addEventListener('click', () => {
      applyAbteilung(abt.id);
      setCookie('abteilung', abt.id, 365);
    });
    container.appendChild(btn);
  });
  applyAbteilung(getCookie('abteilung') || '');
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
