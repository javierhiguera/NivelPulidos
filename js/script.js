const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.nav nav');

menuToggle?.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    menuToggle.classList.toggle('active');
});

const navLinks = document.querySelectorAll('.nav nav a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuToggle.classList.remove('active');
    });
});

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
            
            const changeEvent = new Event('change', { bubbles: true });
            hiddenInput.dispatchEvent(changeEvent);
        });
    });
});

document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select.open').forEach(select => {
        select.classList.remove('open');
        select.querySelector('.custom-select-trigger').setAttribute('aria-expanded', 'false');
    });
});

const form = document.querySelector("#quote-form");

form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const getFieldValue = (id) => {
        const element = document.getElementById(id);
        if (!element) return '';
        if (element.type === 'hidden') return element.value;
        return element.value.trim();
    };

    const nombre = getFieldValue('nombre');
    const telefono = getFieldValue('telefono');
    const localidad = getFieldValue('localidad');
    const superficie = getFieldValue('superficie');
    const servicio = getFieldValue('servicio');
    const metros = getFieldValue('metros');
    const descripcion = document.getElementById('descripcion')?.value.trim() || '';

    let hasError = false;
    let errorMessage = 'Por favor, completá los siguientes campos:\n';

    if (!nombre) { errorMessage += '- Nombre\n'; hasError = true; }
    if (!telefono) { errorMessage += '- WhatsApp\n'; hasError = true; }
    if (!localidad) { errorMessage += '- Localidad\n'; hasError = true; }
    if (!superficie) { errorMessage += '- Tipo de superficie\n'; hasError = true; }
    if (!servicio) { errorMessage += '- Servicio\n'; hasError = true; }

    if (hasError) {
        alert(errorMessage);
        return;
    }

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

    const url = "https://wa.me/541124830787?text=" + encodeURIComponent(mensaje);
    window.open(url, "_blank");
});

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

        if (!horizontalConfirmed && deltaY > deltaX && deltaY > 8) {
            dragging = false;
            control.releasePointerCapture?.(event.pointerId);
            pointerId = null;
            return;
        }

        if (!horizontalConfirmed && deltaX > deltaY && deltaX > 5) {
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

const gallery = document.querySelector("#gallery-track");
const btnPrev = document.querySelector(".gallery-nav-btn.prev");
const btnNext = document.querySelector(".gallery-nav-btn.next");

if (gallery && btnPrev && btnNext) {
    btnPrev.addEventListener("click", () => {
        gallery.scrollBy({ left: -350, behavior: 'smooth' });
    });

    btnNext.addEventListener("click", () => {
        gallery.scrollBy({ left: 350, behavior: 'smooth' });
    });

    let draggingGallery = false;
    let galleryPointerId = null;
    let galleryStartX = 0;
    let galleryStartY = 0;
    let galleryStartScroll = 0;
    let galleryHorizontal = false;

    gallery.addEventListener("pointerdown", (event) => {
        if (event.target.closest(".comparison-control")) return;
        if (event.pointerType === "mouse" && event.button !== 0) return;

        draggingGallery = true;
        galleryPointerId = event.pointerId;
        galleryStartX = event.clientX;
        galleryStartY = event.clientY;
        galleryStartScroll = gallery.scrollLeft;
        galleryHorizontal = event.pointerType === "mouse";

        if (event.pointerType === "mouse") {
            gallery.setPointerCapture?.(event.pointerId);
        }
    });

    gallery.addEventListener("pointermove", (event) => {
        if (!draggingGallery || event.pointerId !== galleryPointerId) return;

        const deltaX = event.clientX - galleryStartX;
        const deltaY = event.clientY - galleryStartY;

        if (event.pointerType === "touch" && !galleryHorizontal) {
            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);
            if (absY > absX && absY > 8) {
                draggingGallery = false;
                galleryPointerId = null;
                return;
            }
            if (absX > absY && absX > 8) {
                galleryHorizontal = true;
            }
        }

        if (!galleryHorizontal) return;

        gallery.scrollLeft = galleryStartScroll - deltaX;

        if (event.pointerType === "touch") {
            event.preventDefault();
        }
    }, { passive: false });

    function stopGalleryDrag(event) {
        if (event.pointerId !== galleryPointerId) return;
        draggingGallery = false;
        galleryHorizontal = false;
        if (event.pointerType === "mouse") {
            gallery.releasePointerCapture?.(event.pointerId);
        }
        galleryPointerId = null;
    }

    gallery.addEventListener("pointerup", stopGalleryDrag);
    gallery.addEventListener("pointercancel", stopGalleryDrag);
}

document.querySelectorAll('.custom-select input[type="hidden"]').forEach(hidden => {
    hidden.addEventListener('change', function() {
        const parent = this.closest('.custom-select');
        if (this.value) {
            parent.classList.remove('invalid');
        }
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
