// MODELO: un soneto (título, autor y 14 versos). Comprueba que tiene 14 versos
// y los agrupa en su estructura fija: dos cuartetos y dos tercetos.
export class Soneto {
  constructor({ id, titulo, autor, versos }) {
    if (versos.length !== 14) {
      throw new Error(`El soneto "${titulo}" tiene ${versos.length} versos; debe tener 14.`);
    }
    this.id = id;
    this.titulo = titulo;
    this.autor = autor;
    this.versos = versos;
  }

  get estrofas() {
    return [
      { nombre: "Primer cuarteto", versos: this.versos.slice(0, 4) },
      { nombre: "Segundo cuarteto", versos: this.versos.slice(4, 8) },
      { nombre: "Primer terceto", versos: this.versos.slice(8, 11) },
      { nombre: "Segundo terceto", versos: this.versos.slice(11, 14) },
    ];
  }
}
