// VISTA: única parte que toca el DOM y el CSSOM. Pinta el índice y el soneto,
// aplica el tema (atributo data-tema) y el tamaño (variable CSS --tamano-lectura)
// y avisa al controlador de lo que hace el usuario.
// Los elementos se localizan por atributos data-vista / data-accion, no por clases
// de estilo, para que cambiar el CSS no rompa el JS.
const raiz = document.documentElement;
const oscuroSistema = matchMedia("(prefers-color-scheme: dark)");

const $ = (selector) => document.querySelector(selector);

export class Vista {
  #indice = $('[data-vista="indice"]');
  #soneto = $('[data-vista="soneto"]');
  #posicion = $('[data-vista="posicion"]');
  #aviso = $('[data-vista="aviso"]');
  #botonTema = $('[data-accion="tema"]');
  #botonMenos = $('[data-accion="tamano-menos"]');
  #botonMas = $('[data-accion="tamano-mas"]');

  renderIndice(sonetos) {
    this.#indice.replaceChildren(
      ...sonetos.map(({ id, titulo, autor }) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "indice__boton";
        boton.dataset.accion = "ver";
        boton.dataset.id = id;

        const nombre = document.createElement("span");
        nombre.className = "indice__nombre";
        nombre.textContent = titulo;

        const firma = document.createElement("span");
        firma.className = "indice__autor";
        firma.textContent = autor;

        boton.append(nombre, firma);

        const item = document.createElement("li");
        item.append(boton);
        return item;
      }),
    );
  }

  mostrarSoneto(soneto, posicion, total) {
    const cabecera = document.createElement("header");
    cabecera.className = "soneto__cabecera";

    const titulo = document.createElement("h2");
    titulo.className = "soneto__titulo";
    titulo.tabIndex = -1; // para poder llevarle el foco al elegir en el índice
    titulo.textContent = soneto.titulo;

    const autor = document.createElement("p");
    autor.className = "soneto__autor";
    autor.textContent = soneto.autor;

    cabecera.append(titulo, autor);

    const cuerpo = document.createElement("div");
    cuerpo.className = "soneto__cuerpo";
    cuerpo.append(...soneto.estrofas.map((estrofa) => this.#crearEstrofa(estrofa)));

    this.#soneto.replaceChildren(cabecera, cuerpo);
    this.#posicion.textContent = `${posicion + 1} de ${total}`;
    this.#marcarActivo(soneto.id);
    document.title = `${soneto.titulo} · Sonetos`;
  }

  // Mensaje para el lector de pantalla (región aria-live oculta).
  // Se vacía antes para que se anuncie aunque el texto se repita.
  anunciar(texto = "") {
    this.#aviso.textContent = "";
    if (texto) requestAnimationFrame(() => (this.#aviso.textContent = texto));
  }

  // Los botones vienen desactivados en el HTML hasta que el controlador arranca.
  activarControles() {
    document.querySelectorAll("[data-accion]").forEach((boton) => (boton.disabled = false));
  }

  mostrarError(mensaje) {
    const aviso = document.createElement("p");
    aviso.setAttribute("role", "alert");
    aviso.textContent = mensaje;
    this.#soneto.replaceChildren(aviso);
    // Sin datos los botones no harían nada: se desactivan para no engañar al usuario.
    document.querySelectorAll("[data-accion]").forEach((boton) => (boton.disabled = true));
  }

  // Lleva la vista y el foco al soneto (el lector de pantalla lee su título).
  // Solo desplaza si el título no está ya a la vista (en escritorio no mueve la página).
  llevarAlSoneto() {
    const titulo = this.#soneto.querySelector("h2");
    const { top, bottom } = titulo.getBoundingClientRect();
    if (top < 0 || bottom > innerHeight) this.#soneto.scrollIntoView({ block: "start" });
    titulo.focus({ preventScroll: true });
  }

  #crearEstrofa({ nombre, versos }) {
    const estrofa = document.createElement("section");
    estrofa.className = "soneto__estrofa";

    // Encabezado de la estrofa solo para el lector de pantalla («Primer cuarteto»…).
    const encabezado = document.createElement("h3");
    encabezado.className = "solo-lector";
    encabezado.textContent = nombre;

    estrofa.append(
      encabezado,
      ...versos.map((texto) => {
        const verso = document.createElement("p");
        verso.className = "soneto__verso";
        verso.textContent = texto;
        return verso;
      }),
    );
    return estrofa;
  }

  #marcarActivo(id) {
    this.#indice.querySelectorAll('[data-accion="ver"]').forEach((boton) => {
      if (boton.dataset.id === id) {
        boton.setAttribute("aria-current", "true");
      } else {
        boton.removeAttribute("aria-current");
      }
    });
  }

  sistemaEnOscuro() {
    return oscuroSistema.matches;
  }

  // Avisa cuando el sistema cambia entre modo claro y oscuro.
  alCambiarTemaSistema(manejador) {
    oscuroSistema.addEventListener("change", (evento) => manejador(evento.matches));
  }

  aplicarTema(oscuro) {
    raiz.dataset.tema = oscuro ? "oscuro" : "claro";
    this.#botonTema.setAttribute("aria-pressed", String(oscuro));
  }

  // Tamaño inicial definido en el CSS (tokens.css), para no repetirlo en el JS.
  tamanoInicial() {
    const valor = getComputedStyle(raiz).getPropertyValue("--tamano-lectura").trim();
    if (!valor.endsWith("rem")) throw new Error(`--tamano-lectura debe ir en rem (vale "${valor}").`);
    return parseFloat(valor);
  }

  // aria-disabled (y no disabled) para que el botón conserve el foco al llegar al límite.
  aplicarTamano(rem, puedeReducir, puedeAumentar) {
    raiz.style.setProperty("--tamano-lectura", `${rem}rem`);
    this.#botonMenos.setAttribute("aria-disabled", String(!puedeReducir));
    this.#botonMas.setAttribute("aria-disabled", String(!puedeAumentar));
  }

  // Un solo escuchador en document atiende todos los botones (delegación de eventos).
  alPulsar(manejador) {
    document.addEventListener("click", (evento) => {
      const boton = evento.target.closest("[data-accion]");
      if (boton) manejador(boton.dataset.accion, boton.dataset.id);
    });
  }

  alTeclear(manejador) {
    document.addEventListener("keydown", (evento) => {
      // Alt/Ctrl/Meta/Mayús + flecha son atajos del navegador; mantener pulsada no recorre la lista.
      if (evento.altKey || evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.repeat) return;
      manejador(evento.key);
    });
  }
}
