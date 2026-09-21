// MODELO: un soneto (título, autor y 14 versos). Comprueba que tiene 14 versos
// y los agrupa en su estructura fija: dos cuartetos y dos tercetos.
const ESTRUCTURA = [
  { tipo: "cuarteto", versos: 4 },
  { tipo: "cuarteto", versos: 4 },
  { tipo: "terceto", versos: 3 },
  { tipo: "terceto", versos: 3 },
];

const TOTAL_VERSOS = ESTRUCTURA.reduce((suma, { versos }) => suma + versos, 0);

export class Soneto {
  constructor({ id, titulo, autor, versos }) {
    if (versos.length !== TOTAL_VERSOS) {
      throw new Error(
        `El soneto "${titulo}" tiene ${versos.length} versos; debe tener ${TOTAL_VERSOS}.`,
      );
    }
    this.id = id;
    this.titulo = titulo;
    this.autor = autor;
    this.versos = versos;
  }

  get estrofas() {
    let inicio = 0;
    return ESTRUCTURA.map(({ tipo, versos }) => {
      const estrofa = { tipo, inicio: inicio + 1, versos: this.versos.slice(inicio, inicio + versos) };
      inicio += versos;
      return estrofa;
    });
  }
}
