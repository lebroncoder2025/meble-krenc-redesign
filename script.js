const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

const setMenu = (isOpen) => {
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  siteNav.classList.toggle('is-open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
};

menuToggle?.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

siteNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const filterButtons = document.querySelectorAll('[data-filter]');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    projectCards.forEach((card) => {
      const isVisible = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !isVisible);
    });
  });
});

const projectDetails = {
  kuchnia: {
    label: '01 / Na wymiar',
    title: 'Ciepło codzienności',
    text: 'Zabudowa, która porządkuje codzienny rytm. Przy projekcie mebli na wymiar liczy się nie tylko wygląd, ale też wygodny układ, właściwe proporcje i materiały, które dobrze znoszą życie.',
    image: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=1400&q=85',
    alt: 'Minimalistyczna kuchnia z drewnianą wyspą'
  },
  krzeslo: {
    label: '02 / Renowacja',
    title: 'Drugie życie',
    text: 'Nie wszystko, co stare, trzeba wymieniać. Czasem wystarczy przywrócić formę, zadbać o konstrukcję i dobrać nową tapicerkę, żeby ulubiony mebel znów pasował do wnętrza.',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1400&q=85',
    alt: 'Drewniane krzesło w jasnym wnętrzu'
  },
  detal: {
    label: '03 / Detal',
    title: 'Materiał mówi sam',
    text: 'Dobrze dobrany materiał buduje atmosferę całego wnętrza. Rozmawiamy o kolorze, fakturze, wykończeniu i tym, jak mebel będzie używany na co dzień.',
    image: 'https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=1400&q=85',
    alt: 'Detal drewnianego mebla i naturalnego materiału'
  },
  strefa: {
    label: '04 / Na wymiar',
    title: 'Spokojna przestrzeń',
    text: 'Najlepsze zabudowy nie dominują wnętrza. Tworzą tło dla życia — mieszczą to, co ważne, wykorzystują miejsce i zostawiają oddech.',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1400&q=85',
    alt: 'Nowoczesna strefa wypoczynku z zabudową meblową'
  }
};

const dialog = document.querySelector('#project-dialog');
const dialogImage = document.querySelector('#dialog-image');
const dialogLabel = document.querySelector('#dialog-label');
const dialogTitle = document.querySelector('#dialog-title');
const dialogText = document.querySelector('#dialog-text');

document.querySelectorAll('[data-project]').forEach((button) => {
  button.addEventListener('click', () => {
    const project = projectDetails[button.dataset.project];
    if (!project || !dialog) return;
    dialogImage.src = project.image;
    dialogImage.alt = project.alt;
    dialogLabel.textContent = project.label;
    dialogTitle.textContent = project.title;
    dialogText.textContent = project.text;
    dialog.showModal();
  });
});

document.querySelectorAll('[data-close-dialog]').forEach((button) => {
  button.addEventListener('click', () => dialog?.close());
});

dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();

const form = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    formStatus.textContent = 'Uzupełnij proszę wszystkie pola.';
    form.reportValidity();
    return;
  }
  formStatus.textContent = 'Dziękujemy — wiadomość jest gotowa do wysłania. Skontaktujemy się z Tobą telefonicznie lub mailowo.';
  form.reset();
});
