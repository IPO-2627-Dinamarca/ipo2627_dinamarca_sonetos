// Punto de entrada: carga los sonetos (modelo), crea la vista y el controlador (MVC)
// y arranca la aplicación. Si no se pueden cargar los datos, la vista lo avisa.
import { Almacen } from "./model/almacen.js";
import { Vista } from "./view/vista.js";
import { Controlador } from "./controller/controlador.js";

const vista = new Vista();

try {
  const almacen = await Almacen.cargar("data/sonetos.json");
  new Controlador(almacen, vista).iniciar();
} catch (error) {
  console.error(error);
  vista.mostrarError("No se han podido cargar los sonetos. Recarga la página para intentarlo de nuevo.");
}
