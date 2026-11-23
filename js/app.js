/* =========================================================
   Los Viajes de Thoo: lo que hace la página
   Orden del archivo:
   1. Fechas y precios      4. Próxima salida (portada)
   2. Fotos y clima (APIs)  5. Filtros y lista de viajes
   3. Tarjetas y detalle    6. Contacto y arranque
   ========================================================= */

/* =========================================================
   1. Fechas y precios
   ========================================================= */

const salidasFuturas = (tour) => tour.salidas.filter((fecha) => fechaDe(fecha) >= hoy());
const tieneSalidas = (tour) => salidasFuturas(tour).length > 0;

// ¿Todavía aplica el precio de pre-compra?
const preventaVigente = (tour) => Boolean(tour.precioAnterior) && fechaDe(tour.preventaHasta) >= hoy();

// El precio que se debe mostrar hoy
const precioActual = (tour) =>
  tour.precioAnterior && !preventaVigente(tour) ? tour.precioAnterior : tour.precio;

// Para ordenar: primero el viaje que sale más pronto
const porProximaSalida = (a, b) => salidasFuturas(a)[0].localeCompare(salidasFuturas(b)[0]);

function mensajeParaTour(tour, fecha) {
  const cuando = fecha ? ` con salida el ${fechaLarga(fecha)}` : "";
  return `Hola, quiero información del viaje "${tour.nombre}"${cuando}. ¿Hay lugares disponibles?`;
}

function crearPrecio(tour) {
  const precio = crear("p", { className: "precio" });
  if (preventaVigente(tour)) {
    precio.append(crear("s", { textContent: dinero(tour.precioAnterior) }), " ");
  }
  precio.append(
    crear("strong", { textContent: dinero(precioActual(tour)) }),
    crear("small", { textContent: tour.tipo === "dia" ? " por persona" : " por persona en hab. doble" })
  );
  return precio;
}

const crearSelloPreventa = (tour) =>
  preventaVigente(tour) &&
  crear("span", { className: "sello", textContent: `Pre-compra hasta el ${fechaCorta(tour.preventaHasta)}` });


/* =========================================================
   2. Fotos (Wikipedia) y clima (Open-Meteo)
   ========================================================= */

const fotosEnMemoria = {};

// Devuelve la foto propia del viaje o, si no hay, una de Wikipedia
function cargarFoto(tour) {
  if (tour.imagen) return Promise.resolve(tour.imagen);

  fotosEnMemoria[tour.id] ??= fetch(
    `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(tour.foto)}`
  )
    .then((respuesta) => (respuesta.ok ? respuesta.json() : null))
    .then((datos) => (datos?.thumbnail ? datos.thumbnail.source.replace(/\/\d+px-/, "/960px-") : null))
    .catch(() => null);

  return fotosEnMemoria[tour.id];
}

// Escribe la temperatura actual de la zona del viaje
async function mostrarClima(tour, destino) {
  if (!tour.lat) return;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${tour.lat}&longitude=${tour.lon}&current=temperature_2m`;
    const datos = await (await fetch(url)).json();
    destino.textContent = `Clima hoy en la zona: ${Math.round(datos.current.temperature_2m)} °C`;
  } catch {
    destino.textContent = "";   // si falla, simplemente no se muestra
  }
}


/* =========================================================
   3. Tarjetas y ventana de detalle
   ========================================================= */

const filtros = { mes: "", region: "", tipo: "" };

// "Salidas: 28 nov, 29 nov, 5 dic y 1 más"
function textoSalidas(tour) {
  const fechas = salidasFuturas(tour).filter((fecha) => !filtros.mes || fecha.startsWith(filtros.mes));
  const primeras = fechas.slice(0, 4).map(fechaCorta).join(", ");
  const sobrantes = fechas.length - 4;
  return `Salidas: ${primeras}${sobrantes > 0 ? ` y ${sobrantes} más` : ""}`;
}

function crearTarjeta(tour) {
  const foto = crear("figure", { className: "tarjeta__foto" },
    crear("span", { className: "tarjeta__tipo", textContent: TIPOS[tour.tipo] }));

  cargarFoto(tour).then((url) => {
    if (url) foto.prepend(crear("img", { src: url, alt: `Vista de ${tour.nombre}`, loading: "lazy" }));
  });

  const botones = crear("div", { className: "tarjeta__botones" },
    crear("button", { className: "boton", textContent: "Ver detalles", onclick: () => abrirDetalle(tour) }),
    crear("a", { className: "boton sol", textContent: "Cotizar", target: "_blank", rel: "noopener",
                 href: enlaceWhatsApp(mensajeParaTour(tour)) }));

  return crear("article", { className: "tarjeta" }, foto,
    crear("div", { className: "tarjeta__cuerpo" },
      crear("h3", { textContent: tour.nombre }),
      crear("p", { className: "tarjeta__dato", textContent: tour.duracion }),
      crear("p", { className: "tarjeta__dato", textContent: textoSalidas(tour) }),
      crearSelloPreventa(tour),
      crearPrecio(tour),
      botones));
}

const crearLista = (elementos) =>
  crear("ul", { className: "lista" }, ...elementos.map((texto) => crear("li", { textContent: texto })));

function abrirDetalle(tour) {
  const ventana = $("#detalle");
  const fechas = salidasFuturas(tour);

  // Foto de portada (llega cuando termina de cargar)
  const portada = crear("div", { className: "detalle__foto" });
  cargarFoto(tour).then((url) => { if (url) portada.style.backgroundImage = `url("${url}")`; });

  // Selector de fecha: el mensaje de WhatsApp lleva la fecha elegida
  const selectorFecha = crear("select", { id: "detalle-fecha" },
    ...fechas.map((fecha) => crear("option", { value: fecha, textContent: fechaLarga(fecha) })));
  const botonWhatsApp = crear("a", { className: "boton sol", textContent: "Cotizar por WhatsApp", target: "_blank", rel: "noopener" });
  const actualizarEnlace = () => { botonWhatsApp.href = enlaceWhatsApp(mensajeParaTour(tour, selectorFecha.value)); };
  selectorFecha.addEventListener("change", actualizarEnlace);
  actualizarEnlace();

  const clima = crear("p", { className: "detalle__clima" });

  ventana.replaceChildren(portada,
    crear("div", { className: "detalle__cuerpo" },
      crear("p", { className: "etiqueta", textContent: TIPOS[tour.tipo] }),
      crear("h2", { textContent: tour.nombre }),
      crear("p", { textContent: tour.duracion }),
      crearSelloPreventa(tour),
      crearPrecio(tour),
      tour.precioMenor && crear("p", { textContent: `Menores (${tour.edadMenores || "2 a 11 años"}): ${dinero(tour.precioMenor)}` }),
      crear("label", { htmlFor: "detalle-fecha", textContent: "Elige tu fecha de salida" }),
      selectorFecha,
      crear("h3", { textContent: "Incluye" }),
      crearLista(tour.incluye),
      tour.visita.length > 0 && crear("h3", { textContent: "Visitas" }),
      tour.visita.length > 0 && crearLista(tour.visita),
      clima,
      crear("p", { className: "nota", textContent: "Consulta términos y condiciones con tu asesor." }),
      crear("div", { className: "tarjeta__botones" },
        botonWhatsApp,
        crear("button", { className: "boton", textContent: "Cerrar", onclick: () => ventana.close() }))));

  ventana.showModal();
  mostrarClima(tour, clima);
}


/* =========================================================
   4. Próxima salida (portada)
   ========================================================= */

function mostrarProximaSalida() {
  const caja = $("#proxima");
  const proximo = TOURS.filter(tieneSalidas).sort(porProximaSalida)[0];

  if (!proximo) { caja.hidden = true; return; }

  const fecha = salidasFuturas(proximo)[0];
  caja.replaceChildren(
    crear("p", { className: "etiqueta", textContent: "Próxima salida" }),
    crear("h2", { textContent: proximo.nombre }),
    crear("p", { textContent: fechaLarga(fecha) }),
    crearPrecio(proximo),
    crear("div", { className: "tarjeta__botones" },
      crear("button", { className: "boton", textContent: "Ver detalles", onclick: () => abrirDetalle(proximo) }),
      crear("a", { className: "boton sol", textContent: "Cotizar", target: "_blank", rel: "noopener",
                   href: enlaceWhatsApp(mensajeParaTour(proximo, fecha)) })));
}


/* =========================================================
   5. Filtros y lista de viajes
   ========================================================= */

const opcion = (valor, texto) => crear("option", { value: valor, textContent: texto });

function llenarFiltros() {
  const disponibles = TOURS.filter(tieneSalidas);

  const meses = [...new Set(disponibles.flatMap(salidasFuturas).map((fecha) => fecha.slice(0, 7)))].sort();
  const regiones = [...new Set(disponibles.map((tour) => tour.region))].sort();

  $("#filtro-mes").replaceChildren(opcion("", "Todos los meses"), ...meses.map((mes) => opcion(mes, nombreDeMes(mes))));
  $("#filtro-region").replaceChildren(opcion("", "Todas las regiones"), ...regiones.map((region) => opcion(region, region)));
  $("#filtro-tipo").replaceChildren(opcion("", "Todos los tipos"), ...Object.entries(TIPOS).map(([clave, texto]) => opcion(clave, texto)));

  // Cada vez que cambia un filtro, se vuelve a dibujar la lista
  [["#filtro-mes", "mes"], ["#filtro-region", "region"], ["#filtro-tipo", "tipo"]].forEach(([selector, nombre]) => {
    $(selector).addEventListener("change", (evento) => {
      filtros[nombre] = evento.target.value;
      mostrarTours();
    });
  });
}

function cumpleFiltros(tour) {
  const salidas = salidasFuturas(tour);
  if (salidas.length === 0) return false;
  if (filtros.mes && !salidas.some((fecha) => fecha.startsWith(filtros.mes))) return false;
  if (filtros.region && tour.region !== filtros.region) return false;
  if (filtros.tipo && tour.tipo !== filtros.tipo) return false;
  return true;
}

function mostrarTours() {
  const visibles = TOURS.filter(cumpleFiltros).sort(porProximaSalida);
  $("#lista-tours").replaceChildren(...visibles.map(crearTarjeta));
  $("#resumen").textContent = visibles.length
    ? `${visibles.length} ${visibles.length === 1 ? "viaje disponible" : "viajes disponibles"}`
    : "No hay viajes con esos filtros. Prueba con otro mes, región o tipo de viaje.";
}


/* =========================================================
   6. Contacto y arranque
   ========================================================= */

function dibujarRedes(contenedor) {
  contenedor.innerHTML = Object.entries(NEGOCIO.redes)
    .map(([red, url]) => `<a href="${url}" target="_blank" rel="noopener" aria-label="${red} de ${NEGOCIO.nombre}">${ICONOS[red]}</a>`)
    .join("");
}

function prepararMenuWhatsApp() {
  const menu = $("#whatsapp-menu");
  const boton = $("#whatsapp-boton");

  menu.append(...MENSAJES_RAPIDOS.map(([texto, mensaje]) =>
    crear("li", {}, crear("a", { href: enlaceWhatsApp(mensaje), target: "_blank", rel: "noopener", textContent: texto }))));

  const alternar = (abierto) => { menu.hidden = !abierto; boton.setAttribute("aria-expanded", abierto); };
  boton.addEventListener("click", () => alternar(menu.hidden));
  document.addEventListener("keydown", (evento) => { if (evento.key === "Escape") alternar(false); });
}

function prepararFormulario() {
  const selectorTour = $("#form-tour");
  selectorTour.append(opcion("", "Aún no lo sé"), ...TOURS.filter(tieneSalidas).map((tour) => opcion(tour.id, tour.nombre)));

  $("#form-contacto").addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nombre = $("#form-nombre").value.trim();
    const personas = Math.max(1, Number($("#form-personas").value) || 1);
    const tour = TOURS.find((t) => t.id === selectorTour.value);

    if (!nombre) { $("#form-mensaje").textContent = "Escribe tu nombre para continuar."; return; }

    const interes = tour ? `del viaje "${tour.nombre}"` : "de sus viajes grupales";
    const mensaje = `Hola, soy ${nombre}. Quiero información ${interes} para ${personas} ${personas === 1 ? "persona" : "personas"}.`;
    $("#form-mensaje").textContent = "Abriendo WhatsApp…";
    window.open(enlaceWhatsApp(mensaje), "_blank", "noopener");
  });
}

function rellenarDatosDelNegocio() {
  document.querySelectorAll("[data-negocio]").forEach((el) => { el.textContent = NEGOCIO[el.dataset.negocio]; });
  document.querySelectorAll("[data-wa]").forEach((enlace) => { enlace.href = enlaceWhatsApp(enlace.dataset.wa); });
  document.querySelectorAll(".redes").forEach(dibujarRedes);
  $("#anio").textContent = new Date().getFullYear();
  $("#detalle").addEventListener("click", (evento) => { if (evento.target === evento.currentTarget) evento.currentTarget.close(); });
}

// Arranque
TOURS.forEach((tour) => tour.salidas.sort());
rellenarDatosDelNegocio();
prepararMenuWhatsApp();
llenarFiltros();
mostrarProximaSalida();
mostrarTours();
prepararFormulario();
