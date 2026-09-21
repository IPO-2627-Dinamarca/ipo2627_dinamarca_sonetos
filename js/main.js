// Punto de entrada: crea el modelo, la vista y el controlador (MVC) y arranca la aplicación.
import { SONETOS } from "./data/sonetos.js";
import { Almacen } from "./model/almacen.js";
import { Preferencias } from "./model/preferencias.js";
import { Vista } from "./view/vista.js";
import { Controlador } from "./controller/controlador.js";

new Controlador(new Almacen(SONETOS), new Preferencias(), new Vista()).iniciar();
