// VISTA: única parte que toca el DOM y el CSSOM. Pinta el índice y el soneto,
// aplica el tema (atributo data-tema) y el tamaño (variable CSS --tamano-lectura)
// y avisa al controlador de lo que hace el usuario.
// Los elementos se localizan por atributos data-vista / data-accion, no por clases
// de estilo, para que cambiar el CSS no rompa el JS.
const raiz = document.documentElement;

const $ = (selector) => document.querySelector(selector);

export class Vista {
  #indice = $('[data-vista="indice"]');
  #soneto = $('[data-vista="soneto"]');
  #posicion = $('[data-vista="posicion"]');
  #botonTema = $('[data-accion="tema"]');
  #botonMenos = $('[data-accion="tamano-menos"]');
  #botonMas = $('[data-accion="tamano-mas"]');

  renderIndice(sonetos) {
    this.#indice.replaceChildren(
      ...sonetos.map(({ id, titulo, autor }) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "indice__enlace";
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

  llevarAlSoneto() {
    this.#soneto.scrollIntoView({ block: "nearest" });
  }

  #crearEstrofa({ nombre, versos }) {
    const estrofa = document.createElement("section");
    estrofa.className = "estrofa";
    estrofa.setAttribute("aria-label", nombre);

    estrofa.append(
      ...versos.map((texto) => {
        const verso = document.createElement("p");
        verso.className = "verso";
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
    return matchMedia("(prefers-color-scheme: dark)").matches;
  }

  aplicarTema(oscuro) {
    raiz.dataset.tema = oscuro ? "oscuro" : "claro";
    this.#botonTema.setAttribute("aria-pressed", String(oscuro));
  }

  aplicarTamano(rem, minimo, maximo) {
    raiz.style.setProperty("--tamano-lectura", `${rem}rem`);
    this.#botonMenos.disabled = rem <= minimo;
    this.#botonMas.disabled = rem >= maximo;
  }

  // Un solo escuchador en document atiende todos los botones (delegación de eventos).
  alPulsar(manejador) {
    document.addEventListener("click", (evento) => {
      const boton = evento.target.closest("[data-accion]");
      if (boton) manejador(boton.dataset.accion, boton.dataset.id);
    });
  }

  alTeclear(manejador) {
    document.addEventListener("keydown", (evento) => manejador(evento.key));
  }
}
