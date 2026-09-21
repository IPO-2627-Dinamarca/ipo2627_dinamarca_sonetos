# Sonetos

La aplicación web consiste en un lector de sonetos. Un `soneto` es una composición poética de 14 versos organizados en cuatro estrofas fijas: dos cuartetos (de 4 versos cada uno) y dos tercetos (de tres versos cada uno). 

Los objetivos del proyecto son: 
- Diseño cromático y tipográfico


# Descripción

- La aplicación interactúa con un solo actor que es el usuario que leerá los sonetos. 
- El sistema dispondrá de un almacén de sonetos entre los que el usuario podrá escoger para proceder a su lectura. Para cada soneto, el almacén recogerá además del propio soneto, su autor y un título identificativo.
- El sistema ofrecerá un mecanismo para que el usuario escoja el soneto que desee leer con el fin de mostrarlo en pantalla. 


# Diseño

## Arquitectura 
- La aplicación deberá estar implementada siguiendo un patrón MVC (_Model-View-Controller_) con objeto de clarificar y diferenciar las distintas responsabilidades. 

## Organización 

- Tanto la distribución del código de los ficheros como la propia organización de los ficheros incluidos en la carpeta del proyecto deberán facilitar la comprensión y el mantenimiento de la solución aportada. 
- Se empleará un mecanismo moderno y apropiado para vincular los ficheros HTML, CSS y JS.

## Estilística

La vista del sistema deberá implementarse con el objeto de diferenciar los distintos aspectos considerados: diseño cromático, tipográfico y espacial. Y cada uno estará cimentado en una sólida estrategia:
  - diseño cromático: monocromática, triádica, complementaria, etc.
  - diseño tipográfico: dos fuentes contrastadas, una única fuente con niveles distintos de realce, etc.
  - diseño espacial: selección de unidades de medida y contenedores, principios de diseño `Gestalt`, etc. 

## Interacción 

La implementación de la interacción estará guiada para favorecer la usabilidad de la aplicación

# Buenas prácticas

- Se deberá cuidar el etiquetado HTML con el objeto de reflejar adecuadamente la estructura de la página y del propio soneto.
- El empleo de una estrategia de selección en CSS de elementos HTML moderna y mantenible
- Una sólida política de coordinación de JS tanto con el DOM (_Document Object Model_) como con el CSSOM (_CSS Object Model_)


# Solución

Hecha solo con HTML, CSS y JavaScript del navegador: sin bibliotecas, sin frameworks, sin fuentes externas y sin instalar nada. Para verla hay que servir la carpeta con cualquier servidor local (por ejemplo, Live Server), porque los módulos de JS no cargan abriendo el archivo con `file://`.

## Estructura

```
index.html              estructura semántica de la página
css/
  tokens.css            variables de diseño: colores, fuentes, espacios (y las tres estrategias)
  base.css              reinicio y accesibilidad
  layout.css            reparto de la página con Grid
  components.css        aspecto de cada componente
js/
  main.js               punto de entrada: une modelo, vista y controlador
  data/sonetos.js       los cinco sonetos
  model/                MODELO: Soneto, Almacen, Preferencias
  view/vista.js         VISTA: la única que toca el DOM
  controller/           CONTROLADOR: une eventos, modelo y vista
sonetos/                textos originales de los sonetos
```

## Arquitectura MVC

- **Modelo** (`js/model/`): `Soneto` comprueba que hay 14 versos y los agrupa en 2 cuartetos y 2 tercetos; `Almacen` guarda la colección; `Preferencias` recuerda tema, tamaño y numeración en `localStorage`.
- **Vista** (`js/view/vista.js`): crea los elementos del índice y del soneto y aplica las preferencias. No toma decisiones; avisa al controlador.
- **Controlador** (`js/controller/controlador.js`): decide qué soneto mostrar y qué hacer con cada botón o tecla.
- HTML, CSS y JS se vinculan con `<link>` y `<script type="module">`; los módulos se cargan sin bloquear la página y cada archivo importa solo lo que necesita.

## Estilística

- **Cromática · complementaria**: burdeos para lo que se lee (títulos) y su complementario, verde azulado, solo para lo interactivo (foco, botón pulsado, soneto activo). Fondo y texto en neutros cálidos, sin negro ni blanco puros. Paleta en `hsl()` parametrizada con `var()` y `calc()`: un único tono base y el complementario se calcula como H + 180. Modo claro/oscuro con `light-dark()` y contrastes texto/fondo WCAG AA.
- **Tipográfica · dos fuentes contrastadas**: serif (Palatino/Georgia) para la voz poética y sans del sistema para la interfaz. Son fuentes que ya tiene el equipo, así que no hay descargas.
- **Espacial**: unidades `rem` con una escala de razón 1,5, medida de línea en `ch` y Grid con áreas con nombre. Gestalt: *proximidad* (versos juntos, estrofas separadas), *similitud* (todas las estrofas con el mismo estilo), *cierre* (el marco del soneto) y *figura/fondo* (superficie clara sobre fondo más oscuro).

## Interacción y usabilidad

- Índice de sonetos, botones Anterior/Siguiente y flechas ← → del teclado.
- Cada soneto tiene su URL (`#id`): funcionan Atrás/Adelante y se puede enlazar.
- Ajustes de lectura: tamaño del texto (A− / A+), numeración de versos y modo oscuro. Se recuerdan entre visitas.
- Accesibilidad: enlace "Saltar al soneto", foco visible, `aria-pressed` y `aria-current` para los estados, botones de al menos 44 px y respeto a `prefers-reduced-motion`.

## Buenas prácticas

- **HTML semántico**: `header`, `nav`, `main`, `article` para el soneto, una `section` por estrofa y un `p` por verso.
- **CSS moderno**: capas `@layer` para controlar la cascada, `:where()` para no subir la especificidad, nombres de clase tipo BEM y anidamiento nativo.
- **JS ↔ DOM**: la vista localiza los elementos por `data-vista` y `data-accion`, no por clases de estilo, y un solo escuchador en `document` atiende todos los botones (delegación de eventos).
- **JS ↔ CSSOM**: el JS no escribe estilos sueltos. Solo cambia la variable `--tamano-lectura`, el atributo `data-tema` y la clase `con-numeracion`; el CSS decide cómo se ve.
