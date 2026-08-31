/* ============================================================
   MENÚ HAMBURGUESA
   ============================================================ */
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.nav nav');

menuToggle?.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    menuToggle.classList.toggle('active');
});

/* ============================================================
   DESPLEGABLES PERSONALIZADOS (FORMULARIO)
   ============================================================ */
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

/* ============================================================
   FORMULARIO → WHATSAPP
   ============================================================ */
const form = document.querySelector("#quote-form");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const getValue = (selector) =>
    document.querySelector(selector)?.value.trim() || "";

  const nombre = getValue("#nombre");
  const telefono = getValue("#telefono");
  const localidad = getValue("#localidad");
  const superficie = getValue("#superficie");
  const servicio = getValue("#servicio");
  const metros = getValue("#metros");
  const descripcion = getValue("#descripcion");

  const mensaje =
`Hola

Vengo de la página de Nivel Pulidos porque me encuentro interesado/a en renovar la imagen de mi piso.

¿Me pueden brindar asesoramiento y presupuesto?

Nombre: ${nombre}
WhatsApp: ${telefono}
Localidad: ${localidad}
Superficie: ${superficie}
Servicio: ${servicio}
Metros cuadrados aproximados: ${metros || "No especificado"}

Descripción:
${descripcion || "Sin descripción adicional."}`;

  const url =
    "https://wa.me/541124830787?text=" +
    encodeURIComponent(mensaje);

  window.open(url, "_blank");
});

/* ============================================================
   COMPARADORES (Antes / Después)
   ============================================================ */
document.querySelectorAll("[data-comparison]").forEach((comparison) => {
  const before = comparison.querySelector(".comparison-before");
  const divider = comparison.querySelector(".comparison-divider");
  const handle = comparison.querySelector(".comparison-handle");
  const control = comparison.querySelector(".comparison-control");

  let position = 50;
  let dragging = false;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let horizontalConfirmed = false;

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
    if (event.pointerType !== "mouse") return;
    dragging = true;
    pointerId = event.pointerId;
    comparison.setPointerCapture?.(event.pointerId);
    updateComparison(positionFromEvent(event));
    event.preventDefault();
  });

  comparison.addEventListener("pointermove", (event) => {
    if (!dragging || event.pointerId !== pointerId) return;
    updateComparison(positionFromEvent(event));
  });

  comparison.addEventListener("pointerup", (event) => {
    if (event.pointerId !== pointerId) return;
    dragging = false;
    pointerId = null;
  });

  comparison.addEventListener("pointercancel", (event) => {
    if (event.pointerId !== pointerId) return;
    dragging = false;
    pointerId = null;
  });

  control.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch") return;
    dragging = true;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    horizontalConfirmed = false;
    control.setPointerCapture?.(event.pointerId);
  });

  control.addEventListener("pointermove", (event) => {
    if (!dragging || event.pointerId !== pointerId) return;

    const deltaX = Math.abs(event.clientX - startX);
    const deltaY = Math.abs(event.clientY - startY);

    if (!horizontalConfirmed && deltaY > deltaX && deltaY > 12) {
      dragging = false;
      control.releasePointerCapture?.(event.pointerId);
      pointerId = null;
      return;
    }

    if (!horizontalConfirmed && deltaX > deltaY && deltaX > 8) {
      horizontalConfirmed = true;
    }

    if (!horizontalConfirmed) return;

    updateComparison(positionFromEvent(event));
    event.preventDefault();
  }, { passive: false });

  function stopMobileComparison(event) {
    if (event.pointerId !== pointerId) return;
    dragging = false;
    horizontalConfirmed = false;
    control.releasePointerCapture?.(event.pointerId);
    pointerId = null;
  }

  control.addEventListener("pointerup", stopMobileComparison);
  control.addEventListener("pointercancel", stopMobileComparison);

  updateComparison(50);
});

/* ============================================================
   CARRUSEL (con flechas, dots y arrastre táctil)
   ============================================================ */
const gallery = document.querySelector("#gallery-track");
const prevBtn = document.querySelector(".gallery-prev");
const nextBtn = document.querySelector(".gallery-next");
const dotsContainer = document.querySelector("#gallery-dots");

if (gallery && dotsContainer) {
  const cards = gallery.querySelectorAll(".gallery-card");
  const totalCards = cards.length;
  let currentIndex = 0;

  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.dataset.index = i;
    dot.setAttribute("aria-label", `Ir al trabajo ${i+1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });
  const dots = dotsContainer.querySelectorAll("button");
  if (dots.length) dots[0].classList.add("active");

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, totalCards - 1));
    const cardWidth = cards[0].offsetWidth + 12;
    gallery.scrollTo({
      left: cardWidth * currentIndex,
      behavior: "smooth"
    });
    dots.forEach((dot, i) => dot.classList.toggle("active", i === currentIndex));
  }

  prevBtn?.addEventListener("click", () => goTo(currentIndex - 1));
  nextBtn?.addEventListener("click", () => goTo(currentIndex + 1));

  gallery.addEventListener("scroll", () => {
    const cardWidth = cards[0]?.offsetWidth + 12 || 1;
    const scrollLeft = gallery.scrollLeft;
    const index = Math.round(scrollLeft / cardWidth);
    if (index !== currentIndex && index >= 0 && index < totalCards) {
      currentIndex = index;
      dots.forEach((dot, i) => dot.classList.toggle("active", i === currentIndex));
    }
  }, { passive: true });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      goTo(currentIndex);
    }, 150);
  });

  let dragData = {
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    startScroll: 0,
    horizontal: false
  };

  gallery.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".comparison-control")) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    dragData.active = true;
    dragData.pointerId = event.pointerId;
    dragData.startX = event.clientX;
    dragData.startY = event.clientY;
    dragData.startScroll = gallery.scrollLeft;
    dragData.horizontal = event.pointerType === "mouse";

    if (event.pointerType === "mouse") {
      gallery.setPointerCapture?.(event.pointerId);
    }
  });

  gallery.addEventListener("pointermove", (event) => {
    if (!dragData.active || event.pointerId !== dragData.pointerId) return;

    const deltaX = event.clientX - dragData.startX;
    const deltaY = event.clientY - dragData.startY;

    if (event.pointerType === "touch" && !dragData.horizontal) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      if (absY > absX && absY > 12) {
        dragData.active = false;
        dragData.pointerId = null;
        return;
      }
      if (absX > absY && absX > 8) {
        dragData.horizontal = true;
      }
    }

    if (!dragData.horizontal) return;

    gallery.scrollLeft = dragData.startScroll - deltaX;

    if (event.pointerType === "touch") {
      event.preventDefault();
    }
  }, { passive: false });

  function stopDrag(event) {
    if (event.pointerId !== dragData.pointerId) return;
    dragData.active = false;
    dragData.horizontal = false;
    if (event.pointerType === "mouse") {
      gallery.releasePointerCapture?.(event.pointerId);
    }
    dragData.pointerId = null;
  }

  gallery.addEventListener("pointerup", stopDrag);
  gallery.addEventListener("pointercancel", stopDrag);
}

/* ============================================================
   BOTÓN VOLVER ARRIBA
   ============================================================ */
const backBtn = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backBtn.classList.add("visible");
  } else {
    backBtn.classList.remove("visible");
  }
}, { passive: true });

backBtn?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
