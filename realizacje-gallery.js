(() => {
  const slots = [...document.querySelectorAll('[data-realization]')];
  if (!slots.length) return;

  const positions = [
    ['0%', '0%'], ['100%', '0%'],
    ['0%', '25%'], ['100%', '25%'],
    ['0%', '50%'], ['100%', '50%'],
    ['0%', '75%'], ['100%', '75%'],
    ['0%', '100%'], ['100%', '100%']
  ];

  fetch('assets/gallery-sprite-final.txt?v=2', { cache: 'force-cache' })
    .then((response) => {
      if (!response.ok) throw new Error('Nie udało się wczytać galerii');
      return response.text();
    })
    .then((data) => {
      const imageUrl = `data:image/webp;base64,${data.trim()}`;
      slots.forEach((slot, index) => {
        const imageIndex = Number(slot.dataset.realization || index + 1) - 1;
        const position = positions[imageIndex] || positions[0];
        slot.style.backgroundImage = `url("${imageUrl}")`;
        slot.style.backgroundPosition = `${position[0]} ${position[1]}`;
        slot.classList.add('is-loaded');
      });
    })
    .catch(() => {
      slots.forEach((slot) => slot.classList.add('is-error'));
    });
})();