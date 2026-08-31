document.addEventListener('DOMContentLoaded', () => {

  // 1. Menú Hamburguesa Móvil
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });

  // 2. Desplegables Personalizados (Custom Select)
  document.querySelectorAll('.custom-select').forEach(selectWrapper => {
    const selected = selectWrapper.querySelector('.select-selected');
    const items = selectWrapper.querySelector('.select-items');
    const inputType = selectWrapper.getAttribute('data-select');
    const hiddenInput = document.getElementById(`${inputType}Input`);

    selected.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllSelects(items);
      items.classList.toggle('select-hide');
    });

    items.querySelectorAll('div').forEach(item => {
      item.addEventListener('click', () => {
        selected.textContent = item.textContent;
        hiddenInput.value = item.getAttribute('data-value');
        items.classList.add('select-hide');
      });
    });
  });

  function closeAllSelects(except) {
    document.querySelectorAll('.select-items').forEach(item => {
      if (item !== except) item.classList.add('select-hide');
    });
  }

  document.addEventListener('click', () => closeAllSelects(null));

  // 3. Formulario Presupuesto a WhatsApp
  const whatsappForm = document.getElementById('whatsappForm');
  whatsappForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const localidad = document.getElementById('localidad').value;
    const superficie = document.getElementById('superficieInput').value || 'No especificada';
    const servicio = document.getElementById('servicioInput').value || 'No especificado';
    const metros = document.getElementById('metros').value;
    const descripcion = document.getElementById('descripcion').value;

    const mensaje = `Hola, solicito presupuesto:%0A` +
      `*Nombre:* ${encodeURIComponent(nombre)}%0A` +
      `*Teléfono:* ${encodeURIComponent(telefono)}%0A` +
      `*Localidad:* ${encodeURIComponent(localidad)}%0A` +
      `*Superficie:* ${encodeURIComponent(superficie)}%0A` +
      `*Servicio:* ${encodeURIComponent(servicio)}%0A` +
      `*Metros²:* ${encodeURIComponent(metros)}%0A` +
      `*Descripción:* ${encodeURIComponent(descripcion)}`;

    window.open(`https://wa.me/123456789?text=${mensaje}`, '_blank');
  });

  // 4. Comparador Deslizante (Antes y Después)
  const baContainer = document.getElementById('beforeAfter');
  const beforeWrapper = document.getElementById('beforeWrapper');
  const sliderHandle = document.getElementById('sliderHandle');
  let isDraggingBA = false;

  const updateSlider = (x) => {
    const rect = baContainer.getBoundingClientRect();
    let offsetX = x - rect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;
    const percentage = (offsetX / rect.width) * 100;
    beforeWrapper.style.width = `${percentage}%`;
    sliderHandle.style.left = `${percentage}%`;
  };

  const onPointerMove = (e) => {
    if (!isDraggingBA) return;
    updateSlider(e.clientX || (e.touches && e.touches[0].clientX));
  };

  baContainer.addEventListener('mousedown', (e) => { isDraggingBA = true; updateSlider(e.clientX); });
  baContainer.addEventListener('touchstart', (e) => { isDraggingBA = true; updateSlider(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('mouseup', () => isDraggingBA = false);
  window.addEventListener('touchend', () => isDraggingBA = false);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  // Ajustar la imagen interna del 'Antes' para mantener proporción
  const beforeImg = beforeWrapper.querySelector('img');
  const syncImageWidth = () => {
    beforeImg.style.width = `${baContainer.offsetWidth}px`;
  };
  window.addEventListener('resize', syncImageWidth);
  syncImageWidth();

  // 5. Carrusel de Trabajos (Arrastre Táctil suave, flechas y puntos)
  const track = document.getElementById('carouselTrack');
  const slides = Array.from(track.children);
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');
  let currentIndex = 0;

  // Generar puntos
  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children);

  const goToSlide = (index) => {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
  };

  prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

  // Arrastre Táctil (Touch & Drag)
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let isDraggingCarousel = false;

  const carouselContainer = document.getElementById('carouselContainer');

  carouselContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDraggingCarousel = true;
  }, { passive: true });

  carouselContainer.addEventListener('touchmove', (e) => {
    if (!isDraggingCarousel) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) goToSlide(currentIndex + 1);
      else goToSlide(currentIndex - 1);
      isDraggingCarousel = false;
    }
  }, { passive: true });

  carouselContainer.addEventListener('touchend', () => { isDraggingCarousel = false; });

  // 6. Botón Volver Arriba en Móviles
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.innerWidth <= 768 && window.scrollY > 300) {
      backToTopBtn.style.display = 'flex';
    } else {
      backToTopBtn.style.display = 'none';
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
