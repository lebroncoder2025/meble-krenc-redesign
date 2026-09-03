const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

const setMenu = (open) => {
  menuToggle?.setAttribute('aria-expanded', String(open));
  siteNav?.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
};

menuToggle?.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

siteNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

document.querySelectorAll('.reveal').forEach((element) => {
  if (revealObserver) revealObserver.observe(element);
  else element.classList.add('is-visible');
});

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const cookieKey = 'mk_cookie_consent';
const cookieBanner = document.querySelector('#cookie-banner');
const cookieModal = document.querySelector('#cookie-modal');
const analyticsInput = document.querySelector('[data-cookie-analytics]');

const readCookie = (name) => document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))?.split('=')[1];
const writeCookie = (name, value, days = 180) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};
const getConsent = () => {
  try { return JSON.parse(decodeURIComponent(readCookie(cookieKey) || '')); } catch { return null; }
};
const showCookieModal = () => {
  const consent = getConsent();
  if (analyticsInput && consent) analyticsInput.checked = Boolean(consent.analytics);
  if (cookieModal) cookieModal.hidden = false;
};
const hideCookieModal = () => { if (cookieModal) cookieModal.hidden = true; };
const saveConsent = (analytics) => {
  writeCookie(cookieKey, JSON.stringify({ necessary: true, analytics: Boolean(analytics) }));
  if (cookieBanner) cookieBanner.hidden = true;
  hideCookieModal();
};

if (!getConsent() && cookieBanner) cookieBanner.hidden = false;
document.querySelectorAll('[data-cookie-accept]').forEach((button) => button.addEventListener('click', () => saveConsent(true)));
document.querySelectorAll('[data-cookie-necessary]').forEach((button) => button.addEventListener('click', () => saveConsent(false)));
document.querySelectorAll('[data-cookie-open]').forEach((button) => button.addEventListener('click', (event) => {
  event.preventDefault();
  showCookieModal();
}));
document.querySelectorAll('[data-cookie-save]').forEach((button) => button.addEventListener('click', () => saveConsent(analyticsInput?.checked)));
document.querySelectorAll('[data-cookie-close]').forEach((button) => button.addEventListener('click', hideCookieModal));
cookieModal?.addEventListener('click', (event) => { if (event.target === cookieModal) hideCookieModal(); });

const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!contactForm.checkValidity()) {
    formStatus.textContent = 'Uzupełnij proszę wszystkie pola.';
    contactForm.reportValidity();
    return;
  }
  formStatus.textContent = 'Dziękujemy. Oddzwonimy lub odpowiemy na podany kontakt.';
  contactForm.reset();
});
