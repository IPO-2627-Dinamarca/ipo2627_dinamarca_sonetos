// MODELO: almacén de sonetos. Guarda la colección y permite buscar por id o por
// posición (porIndice da la vuelta al pasar del último o antes del primero).
import { Soneto } from "./soneto.js";

export class Almacen {
  #sonetos;

  constructor(datos) {
    this.#sonetos = datos.map((dato) => new Soneto(dato));
  }

  listar() {
    return this.#sonetos;
  }

  total() {
    return this.#sonetos.length;
  }

  obtener(id) {
    return this.#sonetos.find((soneto) => soneto.id === id);
  }

  indiceDe(soneto) {
    return this.#sonetos.indexOf(soneto);
  }

  porIndice(indice) {
    if (indice < 0) return this.#sonetos[this.total() - 1];
    if (indice >= this.total()) return this.#sonetos[0];
    return this.#sonetos[indice];
  }
}
