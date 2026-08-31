/* MENÚ RESPONSIVO */
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.nav nav');

menuToggle?.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    menuToggle.classList.toggle('active');
});

/* CERRAR MENÚ AL HACER CLICK EN UN ENLACE */
document.querySelectorAll('#mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuToggle.classList.remove('active');
    });
});

/* DESPLEGABLES PERSONALIZADOS (FORMULARIO) */
document.querySelectorAll('.custom-select').forEach(customSelect => {
    const trigger = customSelect.querySelector('.custom-select-trigger');
    const options = customSelect.querySelectorAll('.custom-option');
    const hiddenInput = customSelect.querySelector('input[type="hidden"]');
    const selectedText = trigger.querySelector('.selected-text');

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.custom-select.open').forEach(select => {
            if (select !== customSelect) select.classList.remove('open');
        });
        customSelect.classList.toggle('open');
        trigger.setAttribute('aria-expanded', customSelect.classList.contains('open'));
    });

    options.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedText.textContent = option.textContent;
            hiddenInput.value = option.dataset.value;
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            customSelect.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        });
    });
});

document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select.open').forEach(select => {
        select.classList.remove('open');
        select.querySelector('.custom-select-trigger').setAttribute('aria-expanded', 'false');
    });
});

/* FORMULARIO WHATSAPP */
const form = document.querySelector("#quote-form");
form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const getValue = (selector) => document.querySelector(selector)?.value.trim() || "";

  const nombre = getValue("#nombre");
  const telefono = getValue("#telefono");
  const localidad = getValue("#localidad");
  const superficie = getValue("#superficie");
  const servicio = getValue("#servicio");
  const metros = getValue("#metros");
  const descripcion = getValue("#descripcion");

  const mensaje = `Hola\n\nVengo de la página de Nivel Pulidos porque me encuentro interesado/a en renovar la imagen de mi piso.\n\n¿Me pueden brindar asesoramiento y presupuesto?\n\nNombre: ${nombre}\nWhatsApp: ${telefono}\nLocalidad: ${localidad}\nSuperficie: ${superficie}\nServicio: ${servicio}\nMetros cuadrados aproximados: ${metros || "No especificado"}\n\nDescripción:\n${descripcion || "Sin descripción adicional."}`;

  const url = "https://wa.me/541124830787?text=" + encodeURIComponent(mensaje);
  window.open(url, "_blank");
});

/* COMPARADORES DE ANTES Y DESPUÉS (OPTIMIZADO PARA TOUCH EN IOS/ANDROID) */
document.querySelectorAll("[data-comparison]").forEach((comparison) => {
  const before = comparison.querySelector(".comparison-before");
  const divider = comparison.querySelector(".comparison-divider");
  const handle = comparison.querySelector(".comparison-handle");
  const control = comparison.querySelector(".comparison-control");

  let dragging = false;

  function updateComparison(clientX) {
    const rect = comparison.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const percentage = (x / rect.width) * 100;
    
    before.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    before.style.webkitClipPath = `inset(0 ${100 - percentage}% 0 0)`;
    divider.style.left = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  const startDrag = (e) => {
    dragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updateComparison(clientX);
  };

  const stopDrag = () => { dragging = false; };

  const moveDrag = (e) => {
    if (!dragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updateComparison(clientX);
  };

  control.addEventListener("mousedown", startDrag);
  control.addEventListener("touchstart", startDrag, { passive: true });

  window.addEventListener("mouseup", stopDrag);
  window.addEventListener("touchend", stopDrag);

  window.addEventListener("mousemove", moveDrag);
  window.addEventListener("touchmove", moveDrag, { passive: true });
});

/* CARRUSEL DE TRABAJOS CON FLECHAS Y PUNTOS INDICADORES */
const track = document.getElementById("gallery-track");
const prevBtn = document.getElementById("gallery-prev");
const nextBtn = document.getElementById("gallery-next");
const dotsContainer = document.getElementById("gallery-dots");

if (track) {
  const slides = Array.from(track.children);
  
  // Generar dots dinámicamente
  slides.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => scrollToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children);

  function updateDots() {
    const slideWidth = slides[0].getBoundingClientRect().width;
    const activeIndex = Math.round(track.scrollLeft / slideWidth);
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === activeIndex);
    });
  }

  function scrollToSlide(index) {
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.scrollTo({ left: slideWidth * index, behavior: "smooth" });
  }

  nextBtn?.addEventListener("click", () => {
    track.scrollBy({ left: track.clientWidth, behavior: "smooth" });
  });

  prevBtn?.addEventListener("click", () => {
    track.scrollBy({ left: -track.clientWidth, behavior: "smooth" });
  });

  track.addEventListener("scroll", updateDots, { passive: true });
}

/* BOTÓN VOLVER ARRIBA */
const backToTopBtn = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    backToTopBtn?.classList.add("show");
  } else {
    backToTopBtn?.classList.remove("show");
  }
});

backToTopBtn?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
