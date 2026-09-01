// ============================================
// 1. MENÚ MÓVIL
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
// 2. GALERÍA CON DESLIZAMIENTO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const gallery = document.getElementById('gallery-track');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  if (gallery && prevBtn && nextBtn) {
    function scrollGallery(direction) {
      const cardWidth = gallery.querySelector('.gallery-card')?.offsetWidth || 0;
      const gap = 18; 
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

    // Arrastre con mouse
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
  }
});

// ============================================
// 3. COMPARADORES (ANTES / DESPUÉS)
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
      
      x = Math.max(0, Math.min(x, rect.width));
      
      const percent = (x / rect.width) * 100;
      
      before.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      before.style.webkitClipPath = `inset(0 ${100 - percent}% 0 0)`;
      
      if (divider) divider.style.left = `${percent}%`;
      if (handle) handle.style.left = `${percent}%`;
    }

    // Mouse
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

    // Touch
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
// 4. FORMULARIO - ENVÍO POR WHATSAPP
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('quote-form');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Obtener valores de los <select> nativos
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
