/* MENÚ RESPONSIVE */
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.nav nav');

menuToggle?.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    menuToggle.classList.toggle('active');
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

/* ENVÍO POR WHATSAPP */
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

/* CONTROLADOR COMPARADOR DE IMÁGENES */
document.querySelectorAll("[data-comparison]").forEach((comparison) => {
  const before = comparison.querySelector(".comparison-before");
  const divider = comparison.querySelector(".comparison-divider");
  const handle = comparison.querySelector(".comparison-handle");
  const control = comparison.querySelector(".comparison-control");

  let position = 50;
  let dragging = false;
  let pointerId = null;

  function updateComparison(value) {
    position = Math.max(0, Math.min(100, Number(value)));
    const right = 100 - position;
    before.style.clipPath = `inset(0 ${right}% 0 0)`;
    before.style.webkitClipPath = `inset(0 ${right}% 0 0)`;
    divider.style.left = position + "%";
    handle.style.left = position + "%";
  }

  function positionFromEvent(event) {
    const rect = comparison.getBoundingClientRect();
    return ((event.clientX - rect.left) / rect.width) * 100;
  }

  comparison.addEventListener("pointerdown", (event) => {
    dragging = true;
    pointerId = event.pointerId;
    comparison.setPointerCapture?.(event.pointerId);
    updateComparison(positionFromEvent(event));
  });

  comparison.addEventListener("pointermove", (event) => {
    if (!dragging || event.pointerId !== pointerId) return;
    updateComparison(positionFromEvent(event));
  });

  function stopDrag(event) {
    if (event.pointerId !== pointerId) return;
    dragging = false;
    comparison.releasePointerCapture?.(event.pointerId);
    pointerId = null;
  }

  comparison.addEventListener("pointerup", stopDrag);
  comparison.addEventListener("pointercancel", stopDrag);
  updateComparison(50);
});

/* CARRUSEL Y NAVEGACIÓN */
const gallery = document.querySelector("#gallery-track");
const prevBtn = document.querySelector("#gallery-prev");
const nextBtn = document.querySelector("#gallery-next");
const dotsContainer = document.querySelector("#gallery-dots");
const cards = document.querySelectorAll(".gallery-card");

if (gallery) {
  cards.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      const cardWidth = cards[0].offsetWidth + 18;
      gallery.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
    });
    dotsContainer?.appendChild(dot);
  });

  const updateDots = () => {
    const cardWidth = cards[0].offsetWidth + 18;
    const activeIndex = Math.round(gallery.scrollLeft / cardWidth);
    document.querySelectorAll(".dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === activeIndex);
    });
  };

  gallery.addEventListener("scroll", updateDots, { passive: true });

  prevBtn?.addEventListener("click", () => {
    const cardWidth = cards[0].offsetWidth + 18;
    gallery.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  });

  nextBtn?.addEventListener("click", () => {
    const cardWidth = cards[0].offsetWidth + 18;
    gallery.scrollBy({ left: cardWidth, behavior: 'smooth' });
  });
}

/* BOTÓN VOLVER ARRIBA */
const backToTopBtn = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn?.classList.add("show");
  } else {
    backToTopBtn?.classList.remove("show");
  }
});

backToTopBtn?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
