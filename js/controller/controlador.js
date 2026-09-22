// CONTROLADOR: recibe los eventos de la vista, consulta el modelo y le dice a la
// vista qué mostrar. Guarda el estado de la lectura: soneto actual, tamaño y tema.
const TAMANO_MIN = 1;
const TAMANO_MAX = 1.75;
const TAMANO_PASO = 0.25;

export class Controlador {
  #almacen;
  #vista;
  #actual;
  #tamano = 1.25;
  #oscuro;

  constructor(almacen, vista) {
    this.#almacen = almacen;
    this.#vista = vista;
  }

  iniciar() {
    this.#vista.renderIndice(this.#almacen.listar());
    this.#mostrar(this.#almacen.porIndice(0));

    this.#oscuro = this.#vista.sistemaEnOscuro();
    this.#vista.aplicarTema(this.#oscuro);
    this.#vista.aplicarTamano(this.#tamano, TAMANO_MIN, TAMANO_MAX);

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

  #ejecutar(accion, id) {
    const posicion = this.#almacen.indiceDe(this.#actual);

    switch (accion) {
      case "ver":
        this.#mostrar(this.#almacen.obtener(id));
        this.#vista.llevarAlSoneto();
        break;
      case "anterior":
        this.#mostrar(this.#almacen.porIndice(posicion - 1));
        break;
      case "siguiente":
        this.#mostrar(this.#almacen.porIndice(posicion + 1));
        break;
      case "tamano-menos":
        this.#cambiarTamano(-TAMANO_PASO);
        break;
      case "tamano-mas":
        this.#cambiarTamano(TAMANO_PASO);
        break;
      case "tema":
        this.#oscuro = !this.#oscuro;
        this.#vista.aplicarTema(this.#oscuro);
        break;
    }
  }

  #cambiarTamano(paso) {
    this.#tamano = Math.min(TAMANO_MAX, Math.max(TAMANO_MIN, this.#tamano + paso));
    this.#vista.aplicarTamano(this.#tamano, TAMANO_MIN, TAMANO_MAX);
  }
}
