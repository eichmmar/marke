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
