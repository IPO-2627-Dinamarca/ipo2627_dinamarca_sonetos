// CONTROLADOR: recibe los eventos de la vista, consulta o modifica el modelo y
// le dice a la vista qué mostrar. El soneto actual se refleja en el hash de la URL
// (#id), así funcionan los botones Atrás/Adelante y se puede enlazar un soneto.
import { TAMANO_MAX, TAMANO_MIN, TAMANO_PASO } from "../model/preferencias.js";

export class Controlador {
  #almacen;
  #preferencias;
  #vista;
  #actual = null;

  constructor(almacen, preferencias, vista) {
    this.#almacen = almacen;
    this.#preferencias = preferencias;
    this.#vista = vista;
  }

  iniciar() {
    this.#vista.renderIndice(this.#almacen.listar());
    this.#aplicarPreferencias();

    this.#vista.alSeleccionar((id) => {
      location.hash = id;
    });
    this.#vista.alPulsarAccion((accion) => this.#ejecutar(accion));
    this.#vista.alTeclear((tecla) => {
      if (tecla === "ArrowLeft") this.#ejecutar("anterior");
      if (tecla === "ArrowRight") this.#ejecutar("siguiente");
    });

    addEventListener("hashchange", () => this.#mostrarDesdeHash(true));
    this.#mostrarDesdeHash(false);
  }

  #aplicarPreferencias() {
    this.#vista.aplicarTema(this.#preferencias.tema);
    this.#vista.aplicarTamano(this.#preferencias.tamano, { minimo: TAMANO_MIN, maximo: TAMANO_MAX });
    this.#vista.aplicarNumeracion(this.#preferencias.numeracion);
  }

  #mostrarDesdeHash(enfocar) {
    const id = decodeURIComponent(location.hash.slice(1));
    const soneto = this.#almacen.obtener(id);
    // Un hash que no es un soneto (p. ej. #lectura del enlace "Saltar al soneto")
    // es un ancla de la página: se deja el soneto que ya se estaba leyendo.
    if (id && !soneto && this.#actual) return;
    this.#mostrar(soneto ?? this.#almacen.porIndice(0), enfocar);
  }

  #mostrar(soneto, enfocar) {
    this.#actual = soneto;
    this.#vista.mostrarSoneto(soneto, this.#almacen.indiceDe(soneto.id), this.#almacen.listar().length);
    if (enfocar) this.#vista.enfocarTitulo();
  }

  #ejecutar(accion) {
    switch (accion) {
      case "anterior":
      case "siguiente": {
        const desplazamiento = accion === "anterior" ? -1 : 1;
        const destino = this.#almacen.porIndice(this.#almacen.indiceDe(this.#actual.id) + desplazamiento);
        location.hash = destino.id;
        break;
      }
      case "tamano-menos":
      case "tamano-mas": {
        const paso = accion === "tamano-mas" ? TAMANO_PASO : -TAMANO_PASO;
        this.#preferencias.tamano = this.#preferencias.tamano + paso;
        this.#vista.aplicarTamano(this.#preferencias.tamano, { minimo: TAMANO_MIN, maximo: TAMANO_MAX });
        break;
      }
      case "numeracion":
        this.#preferencias.numeracion = !this.#preferencias.numeracion;
        this.#vista.aplicarNumeracion(this.#preferencias.numeracion);
        break;
      case "tema":
        this.#preferencias.tema = this.#vista.temaEfectivo() === "oscuro" ? "claro" : "oscuro";
        this.#vista.aplicarTema(this.#preferencias.tema);
        break;
    }
  }
}
