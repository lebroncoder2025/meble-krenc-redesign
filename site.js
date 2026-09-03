const body = document.body;
const root = document.documentElement;
const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const FACEBOOK_URL = 'https://www.facebook.com/MebleKrenc/';

const ensureStylesheet = (href) => {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
};
ensureStylesheet('site-v3.css');
ensureStylesheet('site-v4.css');

const favicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/svg+xml';
favicon.href = 'assets/favicon.svg';
if (!favicon.parentNode) document.head.appendChild(favicon);

const icons = {
  facebook: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M13.7 21v-8h2.8l.5-3.2h-3.3V7.7c0-.9.3-1.6 1.7-1.6h1.8V3.2c-.3 0-1.4-.2-2.6-.2-2.6 0-4.4 1.6-4.4 4.6v2.2H7.3V13h2.9v8h3.5Z"/></svg>`,
  external: `<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7"/><path d="M9 7h8v8"/></svg>`,
  right: `<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>`
};

if (menuToggle) {
  menuToggle.innerHTML = `<span class="sr-only">Otwórz menu</span><svg class="menu-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path class="menu-line menu-line-top" d="M4 7h16"/><path class="menu-line menu-line-mid" d="M8 12h12"/><path class="menu-line menu-line-bottom" d="M4 17h16"/></svg>`;
}
const menuLabel = menuToggle?.querySelector('.sr-only');

if (siteNav && !siteNav.querySelector('a[href="index.html"]')) {
  const startLink = document.createElement('a');
  startLink.href = 'index.html';
  startLink.textContent = 'Start';
  siteNav.prepend(startLink);
}

if (siteNav && !siteNav.querySelector('.social-nav-link')) {
  const socialLink = document.createElement('a');
  socialLink.className = 'social-nav-link';
  siteNav.insertBefore(socialLink, siteNav.querySelector('.nav-pill') || null);
}

document.querySelectorAll('.social-nav-link').forEach((link) => {
  link.href = FACEBOOK_URL;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.setAttribute('aria-label', 'Facebook Meble Krenc');
  link.innerHTML = `<span class="social-nav-icon" aria-hidden="true">${icons.facebook}</span><span class="social-nav-text">Facebook</span>`;
});

document.querySelectorAll('.footer-legal').forEach((box) => {
  let link = box.querySelector('.footer-social');
  if (!link) {
    link = document.createElement('a');
    link.className = 'footer-social';
    box.prepend(link);
  }
  link.href = FACEBOOK_URL;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.setAttribute('aria-label', 'Facebook Meble Krenc');
  link.innerHTML = icons.facebook;
});

document.querySelectorAll('.footer-to-top').forEach((el) => el.remove());
document.querySelectorAll('.nav-pill span, .button span, .mk5-btn span, .text-link span').forEach((span) => { span.innerHTML = icons.external; });
document.querySelectorAll('.mk5-card a span:last-child').forEach((span) => { span.innerHTML = icons.right; });
document.querySelectorAll('.map-card > a').forEach((link) => { link.innerHTML = icons.external; });
document.querySelectorAll('.contact-social a > span:last-child').forEach((span) => { span.innerHTML = icons.external; });

const setMenu = (open) => {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  siteNav.classList.toggle('is-open', open);
  body.classList.toggle('menu-open', open);
  root.classList.toggle('menu-open', open);
  if (menuLabel) menuLabel.textContent = open ? 'Zamknij menu' : 'Otwórz menu';
};

menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
siteNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
window.addEventListener('resize', () => { if (window.innerWidth > 720) setMenu(false); });

let ticking = false;
const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 14);
  ticking = false;
};
updateHeader();
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateHeader);
}, { passive: true });

const observer = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries, obs) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    }), { threshold: 0.1 })
  : null;
document.querySelectorAll('.reveal').forEach((el) => observer ? observer.observe(el) : el.classList.add('is-visible'));
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

const privacyKey = 'mk_privacy_choice';
const banner = document.querySelector('#cookie-banner');
const modal = document.querySelector('#cookie-modal');
const readPreference = () => document.cookie.split('; ').some((item) => item.startsWith(`${privacyKey}=`));
const savePreference = () => {
  document.cookie = `${privacyKey}=ok; max-age=15552000; path=/; SameSite=Lax`;
  if (banner) banner.hidden = true;
  if (modal) modal.hidden = true;
};
if (!readPreference() && banner) banner.hidden = false;
document.querySelectorAll('[data-cookie-accept], [data-cookie-save]').forEach((button) => button.addEventListener('click', savePreference));
document.querySelectorAll('[data-cookie-open]').forEach((button) => button.addEventListener('click', (event) => {
  event.preventDefault();
  if (modal) modal.hidden = false;
}));
document.querySelectorAll('[data-cookie-close]').forEach((button) => button.addEventListener('click', () => { if (modal) modal.hidden = true; }));

const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!contactForm.checkValidity()) {
    if (formStatus) formStatus.textContent = 'Uzupełnij wymagane pola.';
    contactForm.reportValidity();
    return;
  }
  const endpoint = String(contactForm.dataset.endpoint || '').trim();
  if (!endpoint) {
    if (formStatus) formStatus.textContent = 'Wysyłka formularza nie jest jeszcze aktywna. Skontaktuj się telefonicznie lub przez Facebook.';
    return;
  }
  const submit = contactForm.querySelector('button[type="submit"]');
  try {
    submit?.setAttribute('disabled', '');
    if (formStatus) formStatus.textContent = 'Wysyłanie…';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(contactForm).entries()))
    });
    if (!response.ok) throw new Error();
    contactForm.reset();
    if (formStatus) formStatus.textContent = 'Dziękujemy. Wiadomość została wysłana.';
  } catch {
    if (formStatus) formStatus.textContent = 'Nie udało się wysłać wiadomości. Spróbuj ponownie.';
  } finally {
    submit?.removeAttribute('disabled');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuToggle.focus();
  }
});