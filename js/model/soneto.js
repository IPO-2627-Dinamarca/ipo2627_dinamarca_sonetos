// MODELO: un soneto (título, autor y 14 versos). Comprueba que los datos son válidos
// y los agrupa en su estructura fija: dos cuartetos y dos tercetos.
export class Soneto {
  constructor(dato) {
    const { id, titulo, autor, versos } = dato ?? {};
    for (const [campo, valor] of Object.entries({ id, titulo, autor })) {
      if (typeof valor !== "string" || valor.trim() === "") {
        throw new Error(`Soneto con "${campo}" vacío o que no es texto.`);
      }
    }
    const versosValidos = Array.isArray(versos) && versos.every((v) => typeof v === "string" && v.trim() !== "");
    if (!versosValidos || versos.length !== 14) {
      throw new Error(`El soneto "${titulo}" debe tener una lista de 14 versos de texto.`);
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
