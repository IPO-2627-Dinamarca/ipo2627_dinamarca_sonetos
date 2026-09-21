import { Soneto } from "./soneto.js";

export class Almacen {
  #sonetos;

  constructor(datos) {
    this.#sonetos = datos.map((dato) => new Soneto(dato));
  }

  listar() {
    return [...this.#sonetos];
  }

  obtener(id) {
    return this.#sonetos.find((soneto) => soneto.id === id) ?? null;
  }

  indiceDe(id) {
    return this.#sonetos.findIndex((soneto) => soneto.id === id);
  }

  porIndice(indice) {
    const total = this.#sonetos.length;
    return this.#sonetos[((indice % total) + total) % total];
  }
}
