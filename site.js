const body = document.body;
const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const menuLabel = menuToggle?.querySelector('.sr-only');
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

if (siteNav && !siteNav.querySelector('.social-nav-link')) {
  const socialLink = document.createElement('a');
  socialLink.className = 'social-nav-link';
  socialLink.href = FACEBOOK_URL;
  socialLink.target = '_blank';
  socialLink.rel = 'noreferrer';
  socialLink.setAttribute('aria-label', 'Facebook Meble Krenc');
  const cta = siteNav.querySelector('.nav-pill');
  siteNav.insertBefore(socialLink, cta || null);
}
document.querySelectorAll('.social-nav-link').forEach((link) => {
  link.href = FACEBOOK_URL;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.setAttribute('aria-label', 'Facebook Meble Krenc');
  link.innerHTML = icons.facebook;
});

document.querySelectorAll('.footer-legal').forEach((footerLinks) => {
  let socialLink = footerLinks.querySelector('.footer-social');
  if (!socialLink) {
    socialLink = document.createElement('a');
    socialLink.className = 'footer-social';
    footerLinks.prepend(socialLink);
  }
  socialLink.href = FACEBOOK_URL;
  socialLink.target = '_blank';
  socialLink.rel = 'noreferrer';
  socialLink.setAttribute('aria-label', 'Facebook Meble Krenc');
  socialLink.innerHTML = icons.facebook;
});

document.querySelectorAll('.footer-to-top').forEach((element) => element.remove());

document.querySelectorAll('.nav-pill span, .button span, .mk5-btn span, .text-link span').forEach((span) => {
  span.innerHTML = icons.external;
});
document.querySelectorAll('.mk5-card a span:last-child').forEach((span) => {
  span.innerHTML = icons.right;
});
document.querySelectorAll('.map-card > a').forEach((link) => {
  link.innerHTML = icons.external;
});
document.querySelectorAll('.contact-social a > span:last-child').forEach((span) => {
  span.innerHTML = icons.external;
});
document.querySelectorAll('.mk5-fb').forEach((link) => {
  link.setAttribute('aria-label', 'Facebook Meble Krenc');
  link.innerHTML = icons.facebook;
});

const setMenu = (open) => {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  siteNav.classList.toggle('is-open', open);
  body.classList.toggle('menu-open', open);
  if (menuLabel) menuLabel.textContent = open ? 'Zamknij menu' : 'Otwórz menu';
};
menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
siteNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
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
    }, { threshold: 0.1, rootMargin: '0px 0px -20px' })
  : null;
document.querySelectorAll('.reveal').forEach((element) => {
  if (revealObserver) revealObserver.observe(element);
  else element.classList.add('is-visible');
});
document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const privacyKey = 'mk_privacy_choice';
const cookieBanner = document.querySelector('#cookie-banner');
const cookieModal = document.querySelector('#cookie-modal');
let cookieReturnFocus = null;

document.querySelectorAll('[data-cookie-analytics]').forEach((input) => input.closest('.cookie-option')?.remove());
document.querySelectorAll('[data-cookie-necessary]').forEach((button) => button.remove());
document.querySelectorAll('[data-cookie-accept]').forEach((button) => { button.textContent = 'Rozumiem'; });
document.querySelectorAll('.cookie-modal .cookie-panel > p').forEach((p) => {
  p.textContent = 'Strona nie używa obecnie cookies analitycznych ani reklamowych.';
});

const readPreference = () => {
  const row = document.cookie.split('; ').find((item) => item.startsWith(`${privacyKey}=`));
  return row ? row.slice(privacyKey.length + 1) : null;
};
const hideCookieModal = () => {
  if (!cookieModal) return;
  cookieModal.hidden = true;
  body.classList.remove('modal-open');
  cookieReturnFocus?.focus?.();
  cookieReturnFocus = null;
};
const savePreference = () => {
  const expires = new Date(Date.now() + 180 * 864e5).toUTCString();
  document.cookie = `${privacyKey}=ok; expires=${expires}; path=/; SameSite=Lax`;
  if (cookieBanner) cookieBanner.hidden = true;
  hideCookieModal();
};
const showCookieModal = (trigger) => {
  if (!cookieModal) return;
  cookieReturnFocus = trigger || document.activeElement;
  cookieModal.hidden = false;
  body.classList.add('modal-open');
  cookieModal.querySelector('button, a')?.focus();
};

if (!readPreference() && cookieBanner) cookieBanner.hidden = false;
document.querySelectorAll('[data-cookie-accept], [data-cookie-save]').forEach((button) => button.addEventListener('click', savePreference));
document.querySelectorAll('[data-cookie-open]').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    showCookieModal(button);
  });
});
document.querySelectorAll('[data-cookie-close]').forEach((button) => button.addEventListener('click', hideCookieModal));
cookieModal?.addEventListener('click', (event) => {
  if (event.target === cookieModal) hideCookieModal();
});

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
    if (formStatus) {
      formStatus.textContent = 'Wysyłka formularza nie jest jeszcze aktywna. Na razie skontaktuj się telefonicznie lub przez Facebook MebleKrenc.';
    }
    return;
  }

  const submit = contactForm.querySelector('button[type="submit"]');
  const data = Object.fromEntries(new FormData(contactForm).entries());

  try {
    submit?.setAttribute('disabled', '');
    if (formStatus) formStatus.textContent = 'Wysyłanie…';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    contactForm.reset();
    if (formStatus) formStatus.textContent = 'Dziękujemy. Wiadomość została wysłana.';
  } catch {
    if (formStatus) formStatus.textContent = 'Nie udało się wysłać wiadomości. Spróbuj ponownie lub zadzwoń: 663 378 388.';
  } finally {
    submit?.removeAttribute('disabled');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (cookieModal && !cookieModal.hidden) {
    hideCookieModal();
    return;
  }
  if (menuToggle?.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuToggle.focus();
  }
});
