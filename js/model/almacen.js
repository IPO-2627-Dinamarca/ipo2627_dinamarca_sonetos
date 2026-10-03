// MODELO: almacén de sonetos. Carga la colección desde el JSON (data/sonetos.json),
// la guarda y permite buscar por id o por posición (porIndice da la vuelta al pasar
// del último o antes del primero).
import { Soneto } from "./soneto.js";

export class Almacen {
  #sonetos;

  // Lanza un error si los datos no son una lista no vacía de sonetos con ids distintos.
  constructor(datos) {
    if (!Array.isArray(datos) || datos.length === 0) {
      throw new Error("El almacén necesita una lista con al menos un soneto.");
    }
    this.#sonetos = datos.map((dato) => new Soneto(dato));
    if (new Set(this.#sonetos.map((soneto) => soneto.id)).size !== this.#sonetos.length) {
      throw new Error("Hay sonetos con el mismo id.");
    }
  }

  // Pide el JSON al servidor y crea el almacén. Si falla, lanza un error.
  static async cargar(url) {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      throw new Error(`No se pudo cargar ${url}: ${respuesta.status} ${respuesta.statusText}`);
    }
    return new Almacen(await respuesta.json());
  }

  listar() {
    return [...this.#sonetos];
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
