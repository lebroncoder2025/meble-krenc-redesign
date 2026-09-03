const body = document.body;
const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const menuLabel = menuToggle?.querySelector('.sr-only');
const FACEBOOK_URL = 'https://www.facebook.com/MebleKrenc/';

/* Load the final shared visual system on pages that do not declare it in <head>. */
if (!document.querySelector('link[href="site-v3.css"]')) {
  const visualSystem = document.createElement('link');
  visualSystem.rel = 'stylesheet';
  visualSystem.href = 'site-v3.css';
  document.head.appendChild(visualSystem);
}

/* Use the dedicated mark as favicon everywhere. */
const favicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/svg+xml';
favicon.href = 'assets/favicon.svg';
if (!favicon.parentNode) document.head.appendChild(favicon);

/* Keep the real company social profile visible on every page. */
if (siteNav && !siteNav.querySelector('.social-nav-link')) {
  const socialLink = document.createElement('a');
  socialLink.className = 'social-nav-link';
  socialLink.href = FACEBOOK_URL;
  socialLink.target = '_blank';
  socialLink.rel = 'noreferrer';
  socialLink.innerHTML = '<span class="fb-dot" aria-hidden="true">f</span> Facebook';
  const cta = siteNav.querySelector('.nav-pill');
  siteNav.insertBefore(socialLink, cta || null);
}

document.querySelectorAll('.footer-legal').forEach((footerLinks) => {
  if (footerLinks.querySelector('.footer-social')) return;
  const socialLink = document.createElement('a');
  socialLink.className = 'footer-social';
  socialLink.href = FACEBOOK_URL;
  socialLink.target = '_blank';
  socialLink.rel = 'noreferrer';
  socialLink.textContent = 'Facebook ↗';
  footerLinks.prepend(socialLink);
});

const setMenu = (open) => {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  siteNav.classList.toggle('is-open', open);
  body.classList.toggle('menu-open', open);
  if (menuLabel) menuLabel.textContent = open ? 'Zamknij menu' : 'Otwórz menu';
};

menuToggle?.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

siteNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 720) setMenu(false);
});

let headerTicking = false;
const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 14);
  headerTicking = false;
};
updateHeader();
window.addEventListener('scroll', () => {
  if (headerTicking) return;
  headerTicking = true;
  requestAnimationFrame(updateHeader);
}, { passive: true });

const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px' })
  : null;

document.querySelectorAll('.reveal').forEach((element) => {
  if (revealObserver) revealObserver.observe(element);
  else element.classList.add('is-visible');
});

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

/* Cookies */
const cookieKey = 'mk_cookie_consent';
const cookieBanner = document.querySelector('#cookie-banner');
const cookieModal = document.querySelector('#cookie-modal');
const analyticsInputs = [...document.querySelectorAll('[data-cookie-analytics]')];
const cookieSettingsStatus = document.querySelector('[data-cookie-settings-status]');
let cookieReturnFocus = null;

const readCookie = (name) => {
  const prefix = `${name}=`;
  const row = document.cookie.split('; ').find((item) => item.startsWith(prefix));
  return row ? row.slice(prefix.length) : null;
};

const writeCookie = (name, value, days = 180) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const getConsent = () => {
  const raw = readCookie(cookieKey);
  if (!raw) return null;
  try { return JSON.parse(decodeURIComponent(raw)); }
  catch { return null; }
};

const syncAnalyticsInputs = (value) => {
  analyticsInputs.forEach((input) => { input.checked = Boolean(value); });
};

const hideCookieModal = () => {
  if (!cookieModal) return;
  cookieModal.hidden = true;
  body.classList.remove('modal-open');
  cookieReturnFocus?.focus?.();
  cookieReturnFocus = null;
};

const showCookieModal = (trigger) => {
  if (!cookieModal) return;
  const consent = getConsent();
  syncAnalyticsInputs(consent?.analytics);
  cookieReturnFocus = trigger || document.activeElement;
  cookieModal.hidden = false;
  body.classList.add('modal-open');
  cookieModal.querySelector('button, input:not([disabled]), a')?.focus();
};

const saveConsent = (analytics, message = 'Ustawienia cookies zostały zapisane.') => {
  writeCookie(cookieKey, JSON.stringify({ necessary: true, analytics: Boolean(analytics) }));
  syncAnalyticsInputs(analytics);
  if (cookieBanner) cookieBanner.hidden = true;
  hideCookieModal();
  if (cookieSettingsStatus) cookieSettingsStatus.textContent = message;
};

const consent = getConsent();
if (!consent && cookieBanner) cookieBanner.hidden = false;
if (consent) syncAnalyticsInputs(consent.analytics);

document.querySelectorAll('[data-cookie-accept]').forEach((button) => button.addEventListener('click', () => saveConsent(true)));
document.querySelectorAll('[data-cookie-necessary]').forEach((button) => button.addEventListener('click', () => saveConsent(false, 'Wybrano tylko niezbędne cookies.')));
document.querySelectorAll('[data-cookie-open]').forEach((button) => button.addEventListener('click', (event) => { event.preventDefault(); showCookieModal(button); }));
document.querySelectorAll('[data-cookie-save]').forEach((button) => button.addEventListener('click', () => {
  const scope = button.closest('.cookie-panel') || document;
  const analyticsInput = scope.querySelector('[data-cookie-analytics]');
  saveConsent(Boolean(analyticsInput?.checked));
}));
document.querySelectorAll('[data-cookie-close]').forEach((button) => button.addEventListener('click', hideCookieModal));
cookieModal?.addEventListener('click', (event) => { if (event.target === cookieModal) hideCookieModal(); });

/* Static contact form: prepare/copy message instead of pretending it was sent. */
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  return copied;
};

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!contactForm.checkValidity()) {
    if (formStatus) formStatus.textContent = 'Uzupełnij wymagane pola.';
    contactForm.reportValidity();
    return;
  }

  const data = new FormData(contactForm);
  const name = String(data.get('name') || '').trim();
  const contact = String(data.get('contact') || '').trim();
  const message = String(data.get('message') || '').trim();
  const prepared = `Zapytanie do Meble Krenc\n\nImię: ${name}\nKontakt: ${contact}\n\n${message}`;

  try {
    const copied = await copyText(prepared);
    if (formStatus) formStatus.textContent = copied
      ? 'Treść została skopiowana. Możesz wkleić ją w Messengerze MebleKrenc lub wykorzystać podczas rozmowy telefonicznej.'
      : 'Nie udało się skopiować treści. Zadzwoń: 663 378 388.';
  } catch {
    if (formStatus) formStatus.textContent = 'Nie udało się skopiować treści. Zadzwoń: 663 378 388.';
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (cookieModal && !cookieModal.hidden) { hideCookieModal(); return; }
  if (menuToggle?.getAttribute('aria-expanded') === 'true') { setMenu(false); menuToggle.focus(); }
});
