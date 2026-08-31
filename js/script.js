const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
  });
}

const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

document.querySelectorAll('.comparison').forEach(container => {
  const before = container.querySelector('.comparison-before');
  const divider = container.querySelector('.comparison-divider');
  const handle = container.querySelector('.comparison-handle');
  const control = container.querySelector('.comparison-control');

  if (!before || !divider || !handle || !control) return;

  let isDragging = false;

  const move = (clientX) => {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;
    const percentage = (x / rect.width) * 100;

    before.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    before.style.webkitClipPath = `inset(0 ${100 - percentage}% 0 0)`;
    divider.style.left = `${percentage}%`;
    handle.style.left = `${percentage}%`;
    control.style.left = `${percentage}%`;
  };

  control.addEventListener('mousedown', () => isDragging = true);
  window.addEventListener('mouseup', () => isDragging = false);
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    move(e.clientX);
  });

  control.addEventListener('touchstart', () => isDragging = true, { passive: true });
  window.addEventListener('touchend', () => isDragging = false);
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    move(e.touches[0].clientX);
  }, { passive: true });
});
