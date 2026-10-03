// CONTROLADOR: recibe los eventos de la vista, consulta el modelo y le dice a la
// vista qué mostrar. Guarda el estado de la lectura: soneto actual, tamaño y tema.
const TAMANO_MIN = 1;
const TAMANO_MAX = 1.75;
const TAMANO_PASO = 0.25;

export class Controlador {
  #almacen;
  #vista;
  #actual;
  #tamano;
  #oscuro;
  #temaElegido = false; // true cuando el usuario pulsa el botón: deja de seguir al sistema

  constructor(almacen, vista) {
    this.#almacen = almacen;
    this.#vista = vista;
  }

  iniciar() {
    this.#vista.renderIndice(this.#almacen.listar());
    this.#mostrar(this.#almacen.porIndice(0));

    this.#tamano = this.#vista.tamanoInicial();
    this.#oscuro = this.#vista.sistemaEnOscuro();
    this.#vista.aplicarTema(this.#oscuro);
    this.#aplicarTamano();

    this.#vista.alCambiarTemaSistema((oscuro) => {
      if (this.#temaElegido) return;
      this.#oscuro = oscuro;
      this.#vista.aplicarTema(oscuro);
    });
    this.#vista.activarControles();
    this.#vista.alPulsar((accion, id) => this.#ejecutar(accion, id));
    this.#vista.alTeclear((tecla) => {
      if (tecla === "ArrowLeft") this.#ejecutar("anterior");
      if (tecla === "ArrowRight") this.#ejecutar("siguiente");
    });
  }

  #mostrar(soneto) {
    this.#actual = soneto;
    this.#vista.mostrarSoneto(soneto, this.#almacen.indiceDe(soneto), this.#almacen.total());
  }

  // Con Anterior/Siguiente el foco se queda en el botón: se anuncia el soneto nuevo.
  // (Desde el índice no hace falta: el foco va al título y el lector ya lo lee.)
  #pasarA(indice) {
    const soneto = this.#almacen.porIndice(indice);
    this.#mostrar(soneto);
    this.#vista.anunciar(`${soneto.titulo}, ${this.#almacen.indiceDe(soneto) + 1} de ${this.#almacen.total()}`);
  }

  #ejecutar(accion, id) {
    const posicion = this.#almacen.indiceDe(this.#actual);

    switch (accion) {
      case "ver": {
        const soneto = this.#almacen.obtener(id);
        if (!soneto) return;
        this.#mostrar(soneto);
        this.#vista.anunciar(); // vacía el aviso anterior: el lector ya lee el título enfocado
        this.#vista.llevarAlSoneto();
        break;
      }
      case "anterior":
        this.#pasarA(posicion - 1);
        break;
      case "siguiente":
        this.#pasarA(posicion + 1);
        break;
      case "tamano-menos":
        this.#cambiarTamano(-TAMANO_PASO);
        break;
      case "tamano-mas":
        this.#cambiarTamano(TAMANO_PASO);
        break;
      case "tema":
        this.#temaElegido = true;
        this.#oscuro = !this.#oscuro;
        this.#vista.aplicarTema(this.#oscuro);
        break;
    }
  }

  #cambiarTamano(paso) {
    this.#tamano = Math.min(TAMANO_MAX, Math.max(TAMANO_MIN, this.#tamano + paso));
    this.#aplicarTamano();
  }

  #aplicarTamano() {
    this.#vista.aplicarTamano(this.#tamano, this.#tamano > TAMANO_MIN, this.#tamano < TAMANO_MAX);
  }
}
