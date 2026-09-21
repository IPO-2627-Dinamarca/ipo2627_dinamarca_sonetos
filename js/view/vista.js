const raiz = document.documentElement;

const $ = (selector) => document.querySelector(selector);

export class Vista {
  #indice = $('[data-vista="indice"]');
  #soneto = $('[data-vista="soneto"]');
  #posicion = $('[data-vista="posicion"]');
  #botonTema = $('[data-accion="tema"]');
  #botonNumeracion = $('[data-accion="numeracion"]');
  #botonMenos = $('[data-accion="tamano-menos"]');
  #botonMas = $('[data-accion="tamano-mas"]');

  renderIndice(sonetos) {
    this.#indice.replaceChildren(
      ...sonetos.map(({ id, titulo, autor }) => {
        const enlace = document.createElement("a");
        enlace.className = "indice__enlace";
        enlace.href = `#${id}`;
        enlace.dataset.id = id;
        enlace.innerHTML = `<span class="indice__nombre"></span><span class="indice__autor"></span>`;
        enlace.querySelector(".indice__nombre").textContent = titulo;
        enlace.querySelector(".indice__autor").textContent = autor;

        const item = document.createElement("li");
        item.append(enlace);
        return item;
      }),
    );
  }

  mostrarSoneto(soneto, indice, total) {
    const cabecera = document.createElement("header");
    cabecera.className = "soneto__cabecera";

    const titulo = document.createElement("h1");
    titulo.className = "soneto__titulo";
    titulo.tabIndex = -1;
    titulo.textContent = soneto.titulo;

    const autor = document.createElement("p");
    autor.className = "soneto__autor";
    autor.textContent = soneto.autor;

    cabecera.append(titulo, autor);

    const cuerpo = document.createElement("div");
    cuerpo.className = "soneto__cuerpo";
    cuerpo.append(...soneto.estrofas.map((estrofa, i) => this.#crearEstrofa(estrofa, i)));

    this.#soneto.replaceChildren(cabecera, cuerpo);
    this.#posicion.textContent = `${indice + 1} de ${total}`;
    this.#marcarActivo(soneto.id);
    document.title = `${soneto.titulo} · ${soneto.autor} · Sonetos`;
  }

  enfocarTitulo() {
    this.#soneto.querySelector(".soneto__titulo")?.focus({ preventScroll: true });
    this.#soneto.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  #crearEstrofa({ tipo, inicio, versos }, posicion) {
    const estrofa = document.createElement("section");
    estrofa.className = "estrofa";
    estrofa.dataset.tipo = tipo;
    estrofa.setAttribute("aria-label", `${tipo === "cuarteto" ? "Cuarteto" : "Terceto"} ${posicion < 2 ? posicion + 1 : posicion - 1}`);

    estrofa.append(
      ...versos.map((texto, i) => {
        const verso = document.createElement("p");
        verso.className = "verso";
        verso.dataset.numero = inicio + i;
        verso.textContent = texto;
        return verso;
      }),
    );
    return estrofa;
  }

  #marcarActivo(id) {
    this.#indice.querySelectorAll(".indice__enlace").forEach((enlace) => {
      if (enlace.dataset.id === id) {
        enlace.setAttribute("aria-current", "true");
      } else {
        enlace.removeAttribute("aria-current");
      }
    });
  }

  aplicarTema(tema) {
    if (tema) {
      raiz.dataset.tema = tema;
    } else {
      delete raiz.dataset.tema;
    }
    this.#botonTema.setAttribute("aria-pressed", String(this.temaEfectivo() === "oscuro"));
  }

  temaEfectivo() {
    if (raiz.dataset.tema) return raiz.dataset.tema;
    return matchMedia("(prefers-color-scheme: dark)").matches ? "oscuro" : "claro";
  }

  aplicarTamano(rem, { minimo, maximo }) {
    raiz.style.setProperty("--tamano-lectura", `${rem}rem`);
    this.#botonMenos.disabled = rem <= minimo;
    this.#botonMas.disabled = rem >= maximo;
  }

  aplicarNumeracion(activa) {
    raiz.classList.toggle("con-numeracion", activa);
    this.#botonNumeracion.setAttribute("aria-pressed", String(activa));
  }

  alSeleccionar(manejador) {
    this.#indice.addEventListener("click", (evento) => {
      const enlace = evento.target.closest(".indice__enlace");
      if (!enlace) return;
      evento.preventDefault();
      manejador(enlace.dataset.id);
    });
  }

  alPulsarAccion(manejador) {
    document.addEventListener("click", (evento) => {
      const boton = evento.target.closest("[data-accion]");
      if (boton && !boton.disabled) manejador(boton.dataset.accion);
    });
  }

  alTeclear(manejador) {
    document.addEventListener("keydown", (evento) => {
      if (evento.altKey || evento.ctrlKey || evento.metaKey) return;
      if (evento.target.closest("input, textarea, select")) return;
      manejador(evento.key);
    });
  }
}
