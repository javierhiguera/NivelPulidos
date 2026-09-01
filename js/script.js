// ============================================
// 1. MENÚ 
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      mobileNav.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });

    document.addEventListener('click', function(e) {
      if (mobileNav.classList.contains('open') && 
          !mobileNav.contains(e.target) && 
          !menuToggle.contains(e.target)) {
        mobileNav.classList.remove('open');
        menuToggle.classList.remove('active');
      }
    });
  }
});

// ============================================
// 2. SELECTORES PERSONALIZADOS - CORREGIDOS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const customSelects = document.querySelectorAll('.custom-select');

  customSelects.forEach(function(select) {
    const trigger = select.querySelector('.custom-select-trigger');
    const options = select.querySelector('.custom-options');
    const hiddenInput = select.querySelector('input[type="hidden"]');
    const selectedText = select.querySelector('.selected-text');

    if (!trigger || !options) return;

    // Abrir/cerrar al hacer clic en el trigger
    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // Cerrar otros selects abiertos
      customSelects.forEach(function(otherSelect) {
        if (otherSelect !== select && otherSelect.classList.contains('open')) {
          otherSelect.classList.remove('open');
          otherSelect.querySelector('.custom-select-trigger').setAttribute('aria-expanded', 'false');
        }
      });

      select.classList.toggle('open');
      const isOpen = select.classList.contains('open');
      trigger.setAttribute('aria-expanded', isOpen);
    });

    // Seleccionar opción
    options.addEventListener('click', function(e) {
      const option = e.target.closest('.custom-option');
      if (!option) return;

      const value = option.getAttribute('data-value');
      const text = option.textContent.trim();

      // Actualizar texto mostrado
      if (selectedText) {
        selectedText.textContent = text;
      }

      // Actualizar input oculto
      if (hiddenInput) {
        hiddenInput.value = value;
      }

      // Marcar opción seleccionada
      options.querySelectorAll('.custom-option').forEach(function(opt) {
        opt.classList.remove('selected');
      });
      option.classList.add('selected');

      // Cerrar el select
      select.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', function(e) {
      if (!select.contains(e.target)) {
        select.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });
});

// ============================================
// 3. GALERÍA CON DESLIZAMIENTO - CORREGIDA
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const gallery = document.getElementById('gallery-track');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  if (gallery && prevBtn && nextBtn) {
    // Función para desplazar la galería
    function scrollGallery(direction) {
      const cardWidth = gallery.querySelector('.gallery-card')?.offsetWidth || 0;
      const gap = 18; // gap entre cards
      const scrollAmount = cardWidth + gap;
      
      if (direction === 'next') {
        gallery.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else {
        gallery.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }

    prevBtn.addEventListener('click', function(e) {
      e.preventDefault();
      scrollGallery('prev');
    });

    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      scrollGallery('next');
    });

    // Soporte para teclado
    gallery.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollGallery('prev');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollGallery('next');
      }
    });

    // Habilitar arrastre con mouse/touch
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    gallery.addEventListener('mousedown', function(e) {
      isDown = true;
      startX = e.pageX - gallery.offsetLeft;
      scrollLeft = gallery.scrollLeft;
      gallery.style.cursor = 'grabbing';
    });

    gallery.addEventListener('mouseleave', function() {
      isDown = false;
      gallery.style.cursor = 'grab';
    });

    gallery.addEventListener('mouseup', function() {
      isDown = false;
      gallery.style.cursor = 'grab';
    });

    gallery.addEventListener('mousemove', function(e) {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - gallery.offsetLeft;
      const walk = (x - startX) * 2;
      gallery.scrollLeft = scrollLeft - walk;
    });

    // Soporte para touch
    let touchStartX = 0;
    let touchScrollLeft = 0;

    gallery.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].pageX - gallery.offsetLeft;
      touchScrollLeft = gallery.scrollLeft;
    }, { passive: true });

    gallery.addEventListener('touchmove', function(e) {
      const x = e.touches[0].pageX - gallery.offsetLeft;
      const walk = (x - touchStartX) * 2;
      gallery.scrollLeft = touchScrollLeft - walk;
    }, { passive: true });
  }
});

// ============================================
// 4. COMPARADORES (ANTES / DESPUÉS) - CORREGIDOS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const comparators = document.querySelectorAll('[data-comparison]');

  comparators.forEach(function(container) {
    const before = container.querySelector('.comparison-before');
    const control = container.querySelector('.comparison-control');
    const divider = container.querySelector('.comparison-divider');
    const handle = container.querySelector('.comparison-handle');

    if (!before || !control) return;

    let isDragging = false;

    function updatePosition(clientX) {
      const rect = container.getBoundingClientRect();
      let x = clientX - rect.left;
      
      // Limitar entre 0 y el ancho del contenedor
      x = Math.max(0, Math.min(x, rect.width));
      
      const percent = (x / rect.width) * 100;
      
      // Actualizar clip-path del antes
      before.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      before.style.webkitClipPath = `inset(0 ${100 - percent}% 0 0)`;
      
      // Mover divisor y manija
      if (divider) {
        divider.style.left = `${percent}%`;
      }
      if (handle) {
        handle.style.left = `${percent}%`;
      }
    }

    // Eventos para mouse
    control.addEventListener('mousedown', function(e) {
      e.preventDefault();
      isDragging = true;
      container.style.cursor = 'ew-resize';
    });

    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      e.preventDefault();
      updatePosition(e.clientX);
    });

    document.addEventListener('mouseup', function() {
      if (isDragging) {
        isDragging = false;
        container.style.cursor = 'default';
      }
    });

    // Eventos para touch
    control.addEventListener('touchstart', function(e) {
      e.preventDefault();
      isDragging = true;
      const touch = e.touches[0];
      updatePosition(touch.clientX);
    }, { passive: false });

    document.addEventListener('touchmove', function(e) {
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.touches[0];
      updatePosition(touch.clientX);
    }, { passive: false });

    document.addEventListener('touchend', function() {
      isDragging = false;
    });

    // Inicializar en 50%
    setTimeout(function() {
      const rect = container.getBoundingClientRect();
      const initialX = rect.left + (rect.width / 2);
      updatePosition(initialX);
    }, 100);
  });
});

// ============================================
// 5. FORMULARIO - ENVÍO POR WHATSAPP
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('quote-form');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const nombre = document.getElementById('nombre')?.value.trim() || '';
      const telefono = document.getElementById('telefono')?.value.trim() || '';
      const localidad = document.getElementById('localidad')?.value.trim() || '';
      const superficie = document.getElementById('superficie')?.value || '';
      const servicio = document.getElementById('servicio')?.value || '';
      const metros = document.getElementById('metros')?.value || '';
      const descripcion = document.getElementById('descripcion')?.value.trim() || '';

      // Validar campos obligatorios
      if (!nombre || !telefono || !localidad || !superficie || !servicio) {
        alert('Por favor, completá todos los campos obligatorios.');
        return;
      }

      // Construir mensaje
      let mensaje = 'Hola Nivel Pulidos,%0A%0A';
      mensaje += 'Vengo de la página web y quiero solicitar un presupuesto:%0A%0A';
      mensaje += `*Nombre:* ${nombre}%0A`;
      mensaje += `*WhatsApp:* ${telefono}%0A`;
      mensaje += `*Localidad:* ${localidad}%0A`;
      mensaje += `*Superficie:* ${superficie}%0A`;
      mensaje += `*Servicio:* ${servicio}%0A`;
      
      if (metros) {
        mensaje += `*Metros cuadrados:* ${metros}%0A`;
      }
      
      if (descripcion) {
        mensaje += `%0A*Descripción:*%0A${descripcion}%0A`;
      }

      // Número de WhatsApp
      const numero = '541124830787';
      const url = `https://wa.me/${numero}?text=${mensaje}`;
      
      window.open(url, '_blank');
    });
  }
});
