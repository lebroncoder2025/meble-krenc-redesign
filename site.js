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
ensureStylesheet('site-v5.css');

const globalFixes = document.createElement('style');
globalFixes.id = 'mk-sitewide-fixes';
globalFixes.textContent = `
.site-header{position:fixed!important;top:0!important;right:0!important;left:0!important;z-index:1000!important;transform:none!important;visibility:visible!important}
.site-header.is-scrolled{box-shadow:0 8px 30px rgba(24,24,22,.08)!important}
.footer-social{width:40px!important;height:40px!important;display:inline-grid!important;place-items:center!important;border:1px solid rgba(255,255,255,.22)!important;border-radius:50%!important;background:transparent!important;color:rgba(255,255,255,.62)!important;box-shadow:none!important;font-size:0!important}
.footer-social:hover{background:rgba(255,255,255,.06)!important;color:#fff!important;border-color:rgba(255,255,255,.38)!important}
.footer-social svg{width:17px!important;height:17px!important;display:block!important;color:inherit!important;fill:currentColor!important}
@media(max-width:1100px){.site-header{position:fixed!important;top:0!important;right:0!important;left:0!important}.footer-social{background:transparent!important;color:rgba(255,255,255,.62)!important}}
`;
document.head.appendChild(globalFixes);

const favicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
favicon.rel = 'icon'; favicon.type = 'image/svg+xml'; favicon.href = 'assets/favicon.svg';
if (!favicon.parentNode) document.head.appendChild(favicon);

const icons = {
  facebook: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M13.7 21v-8h2.8l.5-3.2h-3.3V7.7c0-.9.3-1.6 1.7-1.6h1.8V3.2c-.3 0-1.4-.2-2.6-.2-2.6 0-4.4 1.6-4.4 4.6v2.2H7.3V13h2.9v8h3.5Z"/></svg>`,
  external: `<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7"/><path d="M9 7h8v8"/></svg>`,
  right: `<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>`
};
if (menuToggle) menuToggle.innerHTML = `<span class="sr-only">Otwórz menu</span><svg class="menu-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path class="menu-line menu-line-top" d="M4 7h16"/><path class="menu-line menu-line-mid" d="M8 12h12"/><path class="menu-line menu-line-bottom" d="M4 17h16"/></svg>`;
const menuLabel = menuToggle?.querySelector('.sr-only');
if (siteNav && !siteNav.querySelector('a[href="index.html"]')) { const a=document.createElement('a'); a.href='index.html'; a.textContent='Start'; siteNav.prepend(a); }
if (siteNav && !siteNav.querySelector('.social-nav-link')) { const a=document.createElement('a'); a.className='social-nav-link'; siteNav.insertBefore(a,siteNav.querySelector('.nav-pill')||null); }
document.querySelectorAll('.social-nav-link').forEach((link)=>{link.href=FACEBOOK_URL;link.target='_blank';link.rel='noreferrer';link.setAttribute('aria-label','Facebook Meble Krenc');link.innerHTML=`<span class="social-nav-icon" aria-hidden="true">${icons.facebook}</span><span class="social-nav-text">Facebook</span>`;});
document.querySelectorAll('.footer-legal').forEach((box)=>{let link=box.querySelector('.footer-social');if(!link){link=document.createElement('a');link.className='footer-social';box.prepend(link);}link.href=FACEBOOK_URL;link.target='_blank';link.rel='noreferrer';link.setAttribute('aria-label','Facebook Meble Krenc');link.innerHTML=icons.facebook;});
document.querySelectorAll('.footer-to-top').forEach((el)=>el.remove());
document.querySelectorAll('.nav-pill span, .button span, .mk5-btn span, .text-link span').forEach((span)=>{span.innerHTML=icons.external;});
document.querySelectorAll('.mk5-card a span:last-child').forEach((span)=>{span.innerHTML=icons.right;});
document.querySelectorAll('.map-card > a').forEach((link)=>{link.innerHTML=icons.external;});
document.querySelectorAll('.contact-social a > span:last-child').forEach((span)=>{span.innerHTML=icons.external;});
const setMenu=(open)=>{if(!menuToggle||!siteNav)return;menuToggle.setAttribute('aria-expanded',String(open));siteNav.classList.toggle('is-open',open);body.classList.toggle('menu-open',open);root.classList.toggle('menu-open',open);if(menuLabel)menuLabel.textContent=open?'Zamknij menu':'Otwórz menu';};
menuToggle?.addEventListener('click',()=>setMenu(menuToggle.getAttribute('aria-expanded')!=='true'));
siteNav?.querySelectorAll('a').forEach((link)=>link.addEventListener('click',()=>setMenu(false)));
window.addEventListener('resize',()=>{if(window.innerWidth>1100)setMenu(false);});
let ticking=false;const updateHeader=()=>{header?.classList.toggle('is-scrolled',window.scrollY>14);ticking=false;};updateHeader();window.addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(updateHeader);},{passive:true});
const observer='IntersectionObserver'in window?new IntersectionObserver((entries,obs)=>entries.forEach((entry)=>{if(!entry.isIntersecting)return;entry.target.classList.add('is-visible');obs.unobserve(entry.target);}),{threshold:.1}):null;document.querySelectorAll('.reveal').forEach((el)=>observer?observer.observe(el):el.classList.add('is-visible'));document.querySelectorAll('[data-year]').forEach((el)=>{el.textContent=new Date().getFullYear();});
const privacyKey='mk_privacy_choice';const getCookieValue=(name)=>{const row=document.cookie.split('; ').find((item)=>item.startsWith(`${name}=`));return row?decodeURIComponent(row.split('=').slice(1).join('=')):'';};const readPrivacy=()=>{const raw=getCookieValue(privacyKey);if(!raw)return null;try{return JSON.parse(raw);}catch{return raw==='ok'?{external:false}:null;}};const writePrivacy=(choice)=>{document.cookie=`${privacyKey}=${encodeURIComponent(JSON.stringify(choice))}; max-age=15552000; path=/; SameSite=Lax`;};
let banner=document.querySelector('#cookie-banner');let modal=document.querySelector('#cookie-modal');if(!banner){banner=document.createElement('div');banner.className='cookie-banner';banner.id='cookie-banner';banner.hidden=true;banner.innerHTML=`<div class="cookie-copy"><strong>Prywatność</strong><p>Możesz wybrać, czy wczytywać treści zewnętrzne, takie jak mapa.</p></div><div class="cookie-actions"><button class="cookie-settings" type="button" data-cookie-open>Ustawienia</button><button class="cookie-accept" type="button" data-cookie-accept>Akceptuj wszystko</button></div>`;body.appendChild(banner);}else{const actions=banner.querySelector('.cookie-actions');if(actions)actions.innerHTML=`<button class="cookie-settings" type="button" data-cookie-open>Ustawienia</button><button class="cookie-accept" type="button" data-cookie-accept>Akceptuj wszystko</button>`;const copy=banner.querySelector('.cookie-copy p');if(copy)copy.textContent='Możesz wybrać, czy wczytywać treści zewnętrzne, takie jak mapa.';}
if(!modal){modal=document.createElement('div');modal.className='cookie-modal';modal.id='cookie-modal';modal.hidden=true;body.appendChild(modal);}modal.innerHTML=`<div class="cookie-panel" role="dialog" aria-modal="true" aria-labelledby="cookie-title"><div class="cookie-panel-head"><div><span class="cookie-kicker">Prywatność</span><h2 id="cookie-title">Ustawienia cookies</h2></div><button class="cookie-close-x" type="button" data-cookie-close aria-label="Zamknij">×</button></div><div class="cookie-options"><label class="cookie-option"><span><strong>Niezbędne</strong><small>Zapamiętanie ustawień strony</small></span><input type="checkbox" checked disabled /></label><label class="cookie-option"><span><strong>Treści zewnętrzne</strong><small>Google Maps na stronie kontaktu</small></span><input type="checkbox" data-cookie-external /></label></div><div class="cookie-panel-actions"><button class="button button-outline" type="button" data-cookie-essential>Tylko niezbędne</button><button class="button button-primary" type="button" data-cookie-save>Zapisz ustawienia</button></div></div>`;
const externalToggle=modal.querySelector('[data-cookie-external]');const syncMapConsent=()=>{const choice=readPrivacy();const allowed=Boolean(choice?.external);document.querySelectorAll('[data-cookie-map-src]').forEach((frame)=>{const src=frame.dataset.cookieMapSrc;if(allowed){if(frame.getAttribute('src')!==src)frame.setAttribute('src',src);frame.closest('.map-embed-wrap')?.classList.add('is-loaded');}else{frame.removeAttribute('src');frame.closest('.map-embed-wrap')?.classList.remove('is-loaded');}});};const savePrivacy=(external)=>{writePrivacy({external:Boolean(external)});banner.hidden=true;modal.hidden=true;syncMapConsent();};const openPrivacy=()=>{const choice=readPrivacy();if(externalToggle)externalToggle.checked=Boolean(choice?.external);modal.hidden=false;};if(!readPrivacy())banner.hidden=false;syncMapConsent();document.querySelectorAll('[data-cookie-open]').forEach((button)=>button.addEventListener('click',(event)=>{event.preventDefault();openPrivacy();}));document.querySelectorAll('[data-cookie-close]').forEach((button)=>button.addEventListener('click',()=>{modal.hidden=true;}));document.querySelectorAll('[data-cookie-accept]').forEach((button)=>button.addEventListener('click',()=>savePrivacy(true)));document.querySelectorAll('[data-cookie-essential]').forEach((button)=>button.addEventListener('click',()=>savePrivacy(false)));document.querySelectorAll('[data-cookie-save]').forEach((button)=>button.addEventListener('click',()=>savePrivacy(Boolean(externalToggle?.checked))));document.querySelectorAll('[data-enable-map]').forEach((button)=>button.addEventListener('click',()=>savePrivacy(true)));
const contactForm=document.querySelector('#contact-form');const formStatus=document.querySelector('#form-status');contactForm?.addEventListener('submit',async(event)=>{event.preventDefault();if(!contactForm.checkValidity()){if(formStatus)formStatus.textContent='Uzupełnij wymagane pola.';contactForm.reportValidity();return;}const endpoint=String(contactForm.dataset.endpoint||'').trim();if(!endpoint){if(formStatus)formStatus.textContent='Wysyłka formularza nie jest jeszcze aktywna. Skontaktuj się telefonicznie lub przez Facebook.';return;}const submit=contactForm.querySelector('button[type="submit"]');try{submit?.setAttribute('disabled','');if(formStatus)formStatus.textContent='Wysyłanie…';const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(contactForm).entries()))});if(!response.ok)throw new Error();contactForm.reset();if(formStatus)formStatus.textContent='Dziękujemy. Wiadomość została wysłana.';}catch{if(formStatus)formStatus.textContent='Nie udało się wysłać wiadomości. Spróbuj ponownie.';}finally{submit?.removeAttribute('disabled');}});
document.addEventListener('keydown',(event)=>{if(event.key==='Escape'){if(menuToggle?.getAttribute('aria-expanded')==='true'){setMenu(false);menuToggle.focus();}if(modal&&!modal.hidden)modal.hidden=true;}});