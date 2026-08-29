```javascript
/* ========================= FORMULARIO WHATSAPP ========================= */

const form = document.querySelector("#quote-form");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const getValue = (selector) =>
    document.querySelector(selector)?.value.trim() || "";

  const nombre = getValue("#nombre");
  const telefono = getValue("#telefono");
  const localidad = getValue("#localidad");

  const superficie =
    document.querySelector("#superficie")?.value || "";

  const servicio =
    document.querySelector("#servicio")?.value || "";

  const metros = getValue("#metros");
  const descripcion = getValue("#descripcion");

  const mensaje = `Hola

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

  window.open(
    "https://wa.me/541124830787?text=" +
      encodeURIComponent(mensaje),
    "_blank"
  );
});


/* ========================= SELECTS PERSONALIZADOS ========================= */

const customSelects =
  document.querySelectorAll(".custom-select");

function closeAllSelects(except = null) {

  customSelects.forEach((select) => {

    if (select === except) {
      return;
    }

    select.classList.remove("open");

    select
      .querySelector(".custom-select-trigger")
      ?.setAttribute("aria-expanded", "false");
  });
}


customSelects.forEach((select) => {

  const trigger =
    select.querySelector(".custom-select-trigger");

  const valueDisplay =
    select.querySelector(".custom-select-value");

  const nativeSelect =
    select.querySelector(".custom-select-native");

  const options =
    select.querySelectorAll(".custom-select-option");


  trigger?.addEventListener("click", (event) => {

    event.stopPropagation();

    const isOpen =
      select.classList.contains("open");

    closeAllSelects(select);

    select.classList.toggle(
      "open",
      !isOpen
    );

    trigger.setAttribute(
      "aria-expanded",
      String(!isOpen)
    );
  });


  options.forEach((option) => {

    option.addEventListener("click", (event) => {

      event.stopPropagation();

      const value =
        option.dataset.value ?? "";

      const text =
        option.textContent.trim();


      if (nativeSelect) {
        nativeSelect.value = value;
      }

      if (valueDisplay) {
        valueDisplay.textContent =
          text || "Seleccionar";
      }


      options.forEach((item) => {
        item.classList.remove("selected");
      });

      option.classList.add("selected");


      select.classList.remove("open");

      trigger?.setAttribute(
        "aria-expanded",
        "false"
      );


      nativeSelect?.dispatchEvent(
        new Event("change", {
          bubbles: true
        })
      );

    });

  });

});


document.addEventListener("click", () => {
  closeAllSelects();
});


/* ========================= COMPARADORES ========================= */

document
  .querySelectorAll("[data-comparison]")
  .forEach((comparison) => {

    const before =
      comparison.querySelector(
        ".comparison-before"
      );

    const divider =
      comparison.querySelector(
        ".comparison-divider"
      );

    const handle =
      comparison.querySelector(
        ".comparison-handle"
      );

    const control =
      comparison.querySelector(
        ".comparison-control"
      );


    let position = 50;
    let dragging = false;
    let pointerId = null;

    let touchStartX = 0;
    let touchStartY = 0;
    let horizontal = false;


    function updateComparison(value) {

      position = Math.max(
        0,
        Math.min(100, Number(value))
      );

      const right =
        100 - position;


      before.style.clipPath =
        `inset(0 ${right}% 0 0)`;

      before.style.webkitClipPath =
        `inset(0 ${right}% 0 0)`;


      divider.style.left =
        `${position}%`;

      handle.style.left =
        `${position}%`;
    }


    function getPosition(event) {

      const rect =
        comparison.getBoundingClientRect();

      return (
        (event.clientX - rect.left) /
        rect.width
      ) * 100;
    }


    /* Desktop */

    comparison.addEventListener(
      "pointerdown",
      (event) => {

        if (event.pointerType !== "mouse") {
          return;
        }

        dragging = true;
        pointerId = event.pointerId;


        comparison.setPointerCapture?.(
          event.pointerId
        );


        updateComparison(
          getPosition(event)
        );

        event.preventDefault();
      }
    );


    comparison.addEventListener(
      "pointermove",
      (event) => {

        if (
          !dragging ||
          event.pointerId !== pointerId ||
          event.pointerType !== "mouse"
        ) {
          return;
        }

        updateComparison(
          getPosition(event)
        );
      }
    );


    function stopDesktop(event) {

      if (
        event.pointerId !== pointerId
      ) {
        return;
      }

      dragging = false;
      pointerId = null;
    }


    comparison.addEventListener(
      "pointerup",
      stopDesktop
    );

    comparison.addEventListener(
      "pointercancel",
      stopDesktop
    );


    /* Mobile */

    control?.addEventListener(
      "pointerdown",
      (event) => {

        if (
          event.pointerType !== "touch"
        ) {
          return;
        }

        dragging = true;
        horizontal = false;
        pointerId = event.pointerId;

        touchStartX =
          event.clientX;

        touchStartY =
          event.clientY;


        control.setPointerCapture?.(
          event.pointerId
        );
      }
    );


    control?.addEventListener(
      "pointermove",
      (event) => {

        if (
          !dragging ||
          event.pointerId !== pointerId
        ) {
          return;
        }


        const dx =
          event.clientX -
          touchStartX;

        const dy =
          event.clientY -
          touchStartY;


        if (!horizontal) {

          if (
            Math.abs(dy) >
              Math.abs(dx) &&
            Math.abs(dy) > 8
          ) {

            dragging = false;
            pointerId = null;

            control.releasePointerCapture?.(
              event.pointerId
            );

            return;
          }


          if (
            Math.abs(dx) >
              Math.abs(dy) &&
            Math.abs(dx) > 5
          ) {

            horizontal = true;
          }
        }


        if (!horizontal) {
          return;
        }


        updateComparison(
          getPosition(event)
        );


        event.preventDefault();

      },
      {
        passive: false
      }
    );


    control?.addEventListener(
      "pointerup",
      (event) => {

        if (
          event.pointerId !== pointerId
        ) {
          return;
        }

        dragging = false;
        horizontal = false;
        pointerId = null;
      }
    );


    control?.addEventListener(
      "pointercancel",
      (event) => {

        if (
          event.pointerId !== pointerId
        ) {
          return;
        }

        dragging = false;
        horizontal = false;
        pointerId = null;
      }
    );


    updateComparison(50);

  });


/* ========================= CARRUSEL ========================= */

const gallery =
  document.querySelector(
    "#gallery-track"
  );

const scrollbar =
  document.querySelector(
    "#gallery-scrollbar"
  );

const thumb =
  document.querySelector(
    "#gallery-scrollbar-thumb"
  );


if (
  gallery &&
  scrollbar &&
  thumb
) {

  let draggingBar = false;
  let barPointerId = null;

  let draggingGallery = false;
  let galleryPointerId = null;

  let galleryStartX = 0;
  let galleryStartY = 0;
  let galleryStartScroll = 0;

  let galleryHorizontal = false;


  function getMaxScroll() {

    return Math.max(
      0,
      gallery.scrollWidth -
        gallery.clientWidth
    );
  }


  function syncScrollbar() {

    const maxScroll =
      getMaxScroll();


    if (maxScroll <= 0) {

      thumb.style.width =
        "100%";

      thumb.style.left =
        "0";

      return;
    }


    const visibleRatio =
      gallery.clientWidth /
      gallery.scrollWidth;


    const thumbWidth =
      Math.max(
        25,
        scrollbar.clientWidth *
          visibleRatio
      );


    const available =
      Math.max(
        0,
        scrollbar.clientWidth -
          thumbWidth
      );


    const ratio =
      gallery.scrollLeft /
      maxScroll;


    thumb.style.width =
      `${thumbWidth}px`;

    thumb.style.left =
      `${available * ratio}px`;
  }


  function moveFromBar(clientX) {

    const rect =
      scrollbar.getBoundingClientRect();

    const thumbWidth =
      thumb.offsetWidth;


    const available =
      Math.max(
        0,
        rect.width -
          thumbWidth
      );


    const x =
      Math.max(
        0,
        Math.min(
          available,
          clientX -
            rect.left -
            thumbWidth / 2
        )
      );


    const ratio =
      available > 0
        ? x / available
        : 0;


    gallery.scrollLeft =
      ratio * getMaxScroll();
  }


  scrollbar.addEventListener(
    "pointerdown",
    (event) => {

      event.preventDefault();

      draggingBar = true;
      barPointerId =
        event.pointerId;


      thumb.classList.add(
        "dragging"
      );


      scrollbar.setPointerCapture?.(
        event.pointerId
      );


      moveFromBar(
        event.clientX
      );
    }
  );


  scrollbar.addEventListener(
    "pointermove",
    (event) => {

      if (
        !draggingBar ||
        event.pointerId !==
          barPointerId
      ) {
        return;
      }


      event.preventDefault();


      moveFromBar(
        event.clientX
      );

    },
    {
      passive: false
    }
  );


  function stopBarDrag(event) {

    if (
      event.pointerId !==
      barPointerId
    ) {
      return;
    }


    draggingBar = false;
    barPointerId = null;


    thumb.classList.remove(
      "dragging"
    );
  }


  scrollbar.addEventListener(
    "pointerup",
    stopBarDrag
  );

  scrollbar.addEventListener(
    "pointercancel",
    stopBarDrag
  );


  gallery.addEventListener(
    "scroll",
    syncScrollbar,
    {
      passive: true
    }
  );


  window.addEventListener(
    "resize",
    syncScrollbar
  );


  /* Arrastre del carrusel */

  gallery.addEventListener(
    "pointerdown",
    (event) => {

      if (
        event.target.closest(
          ".comparison-control"
        ) ||
        event.target.closest(
          ".gallery-scrollbar"
        )
      ) {
        return;
      }


      if (
        event.pointerType === "mouse" &&
        event.button !== 0
      ) {
        return;
      }


      draggingGallery = true;
      galleryPointerId =
        event.pointerId;


      galleryStartX =
        event.clientX;

      galleryStartY =
        event.clientY;

      galleryStartScroll =
        gallery.scrollLeft;


      galleryHorizontal =
        event.pointerType ===
        "mouse";


      if (
        event.pointerType ===
        "mouse"
      ) {

        gallery.setPointerCapture?.(
          event.pointerId
        );
      }
    }
  );


  gallery.addEventListener(
    "pointermove",
    (event) => {

      if (
        !draggingGallery ||
        event.pointerId !==
          galleryPointerId
      ) {
        return;
      }


      const dx =
        event.clientX -
        galleryStartX;

      const dy =
        event.clientY -
        galleryStartY;


      if (
        event.pointerType === "touch" &&
        !galleryHorizontal
      ) {

        const absX =
          Math.abs(dx);

        const absY =
          Math.abs(dy);


        if (
          absY > absX &&
          absY > 8
        ) {

          draggingGallery = false;
          galleryPointerId = null;

          return;
        }


        if (
          absX > absY &&
          absX > 8
        ) {

          galleryHorizontal = true;
        }
      }


      if (!galleryHorizontal) {
        return;
      }


      gallery.scrollLeft =
        galleryStartScroll - dx;


      if (
        event.pointerType === "touch"
      ) {
        event.preventDefault();
      }

    },
    {
      passive: false
    }
  );


  function stopGalleryDrag(event) {

    if (
      event.pointerId !==
      galleryPointerId
    ) {
      return;
    }


    draggingGallery = false;
    galleryHorizontal = false;


    if (
      event.pointerType ===
      "mouse"
    ) {

      gallery.releasePointerCapture?.(
        event.pointerId
      );
    }


    galleryPointerId = null;
  }


  gallery.addEventListener(
    "pointerup",
    stopGalleryDrag
  );

  gallery.addEventListener(
    "pointercancel",
    stopGalleryDrag
  );


  gallery.addEventListener(
    "wheel",
    (event) => {

      if (
        Math.abs(event.deltaY) >
          Math.abs(event.deltaX) &&
        getMaxScroll() > 0
      ) {

        event.preventDefault();

        gallery.scrollLeft +=
          event.deltaY;
      }

    },
    {
      passive: false
    }
  );


  requestAnimationFrame(
    syncScrollbar
  );
}
```
