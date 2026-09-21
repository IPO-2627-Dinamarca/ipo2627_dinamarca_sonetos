const CLAVE = "sonetos:preferencias";

export const TAMANO_MIN = 1;
export const TAMANO_MAX = 1.75;
export const TAMANO_PASO = 0.125;

const POR_DEFECTO = { tema: null, tamano: 1.25, numeracion: false };

export class Preferencias {
  #datos;

  constructor() {
    this.#datos = { ...POR_DEFECTO, ...this.#leer() };
  }

  get tema() {
    return this.#datos.tema;
  }

  get tamano() {
    return this.#datos.tamano;
  }

  get numeracion() {
    return this.#datos.numeracion;
  }

  set tema(valor) {
    this.#guardar({ tema: valor });
  }

  set tamano(valor) {
    this.#guardar({ tamano: Math.min(TAMANO_MAX, Math.max(TAMANO_MIN, valor)) });
  }

  set numeracion(valor) {
    this.#guardar({ numeracion: Boolean(valor) });
  }

  #leer() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE)) ?? {};
    } catch {
      return {};
    }
  }

  #guardar(cambios) {
    Object.assign(this.#datos, cambios);
    try {
      localStorage.setItem(CLAVE, JSON.stringify(this.#datos));
    } catch {
      // almacenamiento no disponible: las preferencias solo duran la sesión
    }
  }
}
