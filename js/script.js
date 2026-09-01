v/* ===== MENÚ MÓVIL ===== */
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

/* ===== DESPLEGABLES PERSONALIZADOS SIN GUIONES/PUNTOS ===== */
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
    });

    options.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedText.textContent = option.textContent.trim();
            hiddenInput.value = option.dataset.value;
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            customSelect.classList.remove('open');
            
            const changeEvent = new Event('change', { bubbles: true });
            hiddenInput.dispatchEvent(changeEvent);
        });
    });
});

document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select.open').forEach(select => {
        select.classList.remove('open');
    });
});

/* ===== GALERÍA: CONTROL DE BOTONES LATERALES ===== */
const galleryTrack = document.getElementById('gallery-track');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (galleryTrack && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        const cardWidth = galleryTrack.querySelector('.gallery-card').offsetWidth;
        galleryTrack.scrollBy({ left: -(cardWidth + 20), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        const cardWidth = galleryTrack.querySelector('.gallery-card').offsetWidth;
        galleryTrack.scrollBy({ left: cardWidth + 20, behavior: 'smooth' });
    });
}

/* ===== COMPARADOR DE IMÁGENES (ANTES/DESPUÉS) ===== */
document.querySelectorAll("[data-comparison]").forEach((comparison) => {
    const before = comparison.querySelector(".comparison-before");
    const divider = comparison.querySelector(".comparison-divider");
    const handle = comparison.querySelector(".comparison-handle");
    const control = comparison.querySelector(".comparison-control");

    function updateComparison(clientX) {
        const rect = comparison.getBoundingClientRect();
        let x = clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        const percent = (x / rect.width) * 100;

        before.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
        before.style.webkitClipPath = `inset(0 ${100 - percent}% 0 0)`;
        divider.style.left = percent + "%";
        handle.style.left = percent + "%";
    }

    let isDragging = false;

    control.addEventListener("pointerdown", (e) => {
        isDragging = true;
        updateComparison(e.clientX);
    });

    window.addEventListener("pointermove", (e) => {
        if (isDragging) updateComparison(e.clientX);
    });

    window.addEventListener("pointerup", () => {
        isDragging = false;
    });
});

/* ===== ENVÍO DE FORMULARIO A WHATSAPP ===== */
const form = document.querySelector("#quote-form");

form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre')?.value.trim();
    const telefono = document.getElementById('telefono')?.value.trim();
    const localidad = document.getElementById('localidad')?.value.trim();
    const superficie = document.getElementById('superficie')?.value;
    const servicio = document.getElementById('servicio')?.value;
    const metros = document.getElementById('metros')?.value.trim();
    const descripcion = document.getElementById('descripcion')?.value.trim();

    if (!nombre || !telefono || !localidad || !superficie || !servicio) {
        alert("Por favor completa los campos obligatorios.");
        return;
    }

    const mensaje = `Hola, vengo de la página de Nivel Pulidos.

Solicito cotización:
- Nombre: ${nombre}
- WhatsApp: ${telefono}
- Localidad: ${localidad}
- Superficie: ${superficie}
- Servicio: ${servicio}
- Metros approx: ${metros || "No especificado"}
- Descripción: ${descripcion || "Sin detalles adicionales."}`;

    const url = "https://wa.me/541124830787?text=" + encodeURIComponent(mensaje);
    window.open(url, "_blank");
});
