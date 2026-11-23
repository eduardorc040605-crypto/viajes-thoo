/* =========================================================
   Viajes programados
   ---------------------------------------------------------
   Para agregar un viaje, copia uno de los bloques y cambia
   sus datos. Las fechas van como AAAA-MM-DD, de la más
   cercana a la más lejana.

   Fotos: si tienes una foto propia, guárdala en assets/tours/
   y agrega   imagen: "assets/tours/nombre-de-la-foto.jpg"
   Si no, se busca una foto en Wikipedia con el título de "foto".

   Pre-compra: "precio" es el precio de pre-compra,
   "precioAnterior" es el precio normal, y "preventaHasta"
   es el último día de la pre-compra. Al pasar esa fecha, la
   página muestra sola el precio normal.
   ========================================================= */

const TIPOS = {
  dia: "Tour de un día",
  circuito: "Circuito con vuelo",
  playa: "Escapada de playa"
};

// Los cuatro hoteles de Acapulco comparten fechas y servicios
const SALIDAS_ACAPULCO = ["2027-03-19", "2027-07-16"];

function hotelAcapulco(id, nombre, precio, precioMenor, alimentos) {
  return {
    id,
    nombre: `Hotel ${nombre}, Acapulco`,
    tipo: "playa",
    region: "Pacífico",
    foto: "Acapulco",
    lat: 16.86, lon: -99.88,
    duracion: "3 días, 2 noches",
    salidas: [...SALIDAS_ACAPULCO],
    precio,
    precioMenor,
    edadMenores: "hasta 12 años",
    incluye: ["Transporte terrestre", "Paseo en barco", alimentos],
    visita: []
  };
}

const TOURS = [

  /* ---------- Tours de un día ---------- */
  {
    id: "chignahuapan-zacatlan",
    nombre: "Chignahuapan y Zacatlán",
    tipo: "dia",
    region: "Centro",
    foto: "Chignahuapan",
    lat: 19.84, lon: -98.03,
    duracion: "1 día",
    salidas: ["2026-11-28", "2026-11-29", "2026-12-05", "2026-12-06"],
    precio: 870,
    incluye: ["Transporte terrestre", "Coordinador de grupo", "Seguro de viajero"],
    visita: ["Chignahuapan", "Zacatlán"]
  },
  {
    id: "minas-de-tiza-valquirico",
    nombre: "Minas de Tiza y Val'Quirico",
    tipo: "dia",
    region: "Centro",
    foto: "Tlaxcala_de_Xicohténcatl",
    lat: 19.32, lon: -98.24,
    duracion: "1 día",
    salidas: ["2026-12-13"],
    precio: 1090,
    incluye: ["Transporte terrestre", "Coordinador de grupo", "Seguro de viajero", "Entrada a Minas de Tiza"],
    visita: ["Minas de Tiza", "Centro de Tlaxcala", "Val'Quirico"]
  },
  {
    id: "pancho-pozas-alchichica",
    nombre: "Pancho Pozas y Alchichica",
    tipo: "dia",
    region: "Centro",
    foto: "Laguna_de_Alchichica",
    lat: 19.42, lon: -97.40,
    duracion: "1 día",
    salidas: ["2027-02-28"],
    precio: 860,
    incluye: ["Transporte terrestre", "Coordinador de grupo", "Entrada a la zona", "Seguro de viajero"],
    visita: ["Pancho Pozas", "Alchichica"]
  },
  {
    id: "mariposa-monarca-valle-de-bravo",
    nombre: "Mariposa Monarca y Valle de Bravo",
    tipo: "dia",
    region: "Centro",
    foto: "Valle_de_Bravo",
    lat: 19.19, lon: -100.13,
    duracion: "1 día",
    salidas: ["2027-01-23", "2027-02-20"],
    precio: 945,
    incluye: ["Transporte terrestre", "Coordinador de grupo", "Entrada al Santuario Piedra Herrada", "Seguro de viajero"],
    visita: ["Santuario Piedra Herrada", "Valle de Bravo"]
  },

  /* ---------- Circuitos con vuelo desde CDMX ---------- */
  {
    id: "barrancas-del-cobre",
    nombre: "Barrancas del Cobre 2027",
    tipo: "circuito",
    region: "Norte",
    foto: "Barrancas_del_Cobre",
    lat: 27.75, lon: -107.63,
    duracion: "5 días, 4 noches",
    salidas: [
      "2027-01-20", "2027-01-27", "2027-02-10", "2027-02-24", "2027-03-10", "2027-03-17",
      "2027-04-14", "2027-04-28", "2027-05-12", "2027-05-26", "2027-06-09", "2027-06-23"
    ],
    precio: 21790,
    precioMenor: 17673,
    incluye: ["Vuelo incluido", "Hotel", "Traslados", "Desayunos", "Coordinador de grupo", "Recorrido en tren CHEPE y más tours"],
    visita: []
  },
  {
    id: "senderos-de-kukulkan",
    nombre: "Senderos de Kukulkán",
    tipo: "circuito",
    region: "Sureste",
    foto: "Chichén_Itzá",
    lat: 20.68, lon: -88.57,
    duracion: "7 días, 6 noches",
    salidas: [
      "2027-01-17", "2027-02-14", "2027-02-21", "2027-03-07", "2027-04-04",
      "2027-04-18", "2027-05-16", "2027-05-30", "2027-06-13"
    ],
    precio: 24200,
    precioMenor: 19989,
    incluye: ["Vuelo incluido", "Hotel", "Traslados", "Desayunos", "Coordinador de grupo", "City tour Mérida y Campeche", "Acceso a los sitios del itinerario"],
    visita: ["Mérida", "Izamal", "Chichén Itzá", "Cenote Ik Kil", "Uxmal", "Campeche", "Calakmul", "Bacalar", "Mahahual"]
  },
  {
    id: "ruta-turquesa",
    nombre: "La Ruta Turquesa",
    tipo: "circuito",
    region: "Sureste",
    foto: "Laguna_de_Bacalar",
    lat: 18.68, lon: -88.39,
    duracion: "5 días, 4 noches",
    salidas: [
      "2027-01-21", "2027-02-11", "2027-02-25", "2027-03-11", "2027-03-25",
      "2027-04-08", "2027-04-22", "2027-05-13", "2027-05-27", "2027-06-10"
    ],
    precio: 22411,
    precioMenor: 18200,
    incluye: ["Vuelo incluido", "Hotel", "Traslados", "4 desayunos", "Coordinador de grupo", "City tour Mérida y Campeche", "Acceso a los sitios del itinerario"],
    visita: ["Bacalar", "Mahahual", "Playa del Carmen", "Cenote Casa Tortuga", "Mérida", "Izamal", "Chichén Itzá"]
  },
  {
    id: "norte-de-mexico",
    nombre: "Explorando el norte de México",
    tipo: "circuito",
    region: "Norte",
    foto: "Cuatro_Ciénegas_de_Carranza",
    lat: 26.99, lon: -102.07,
    duracion: "5 días, 4 noches",
    salidas: [
      "2027-04-03", "2027-04-10", "2027-05-01", "2027-05-29", "2027-06-05", "2027-06-26", "2027-08-04",
      "2027-08-24", "2027-09-04", "2027-09-25", "2027-10-02", "2027-10-30", "2027-11-06", "2027-11-27"
    ],
    precio: 22623,
    precioMenor: 18411,
    incluye: ["Vuelo incluido", "Hotel", "Traslados", "4 desayunos", "Coordinador de grupo", "Visitas marcadas en el itinerario", "Acceso a los sitios del itinerario"],
    visita: ["Monterrey", "Cuatro Ciénegas", "Poza Azul", "Dunas de Yeso", "Río Mezquite", "Saltillo", "Parras de la Fuente", "Arteaga", "Monterreal", "Santiago"]
  },
  {
    id: "ballena-gris",
    nombre: "Santuario de la Ballena Gris",
    tipo: "circuito",
    region: "Pacífico",
    foto: "Ballena_gris",
    duracion: "4 días, 3 noches",
    salidas: [
      "2027-01-14", "2027-01-21", "2027-01-28", "2027-02-04", "2027-02-11",
      "2027-02-18", "2027-02-25", "2027-03-04", "2027-03-11"
    ],
    precio: 17674,
    precioMenor: 13463,
    incluye: ["Vuelo incluido", "Hotel", "Traslados", "Desayunos", "Coordinador de grupo", "Avistamiento de ballenas"],
    visita: []
  },

  /* ---------- Escapadas de playa ---------- */
  {
    id: "vamar-vallarta",
    nombre: "Vamar Vallarta, Puerto Vallarta",
    tipo: "playa",
    region: "Pacífico",
    foto: "Puerto_Vallarta",
    lat: 20.65, lon: -105.23,
    duracion: "4 días, 3 noches",
    salidas: ["2027-05-27"],
    precio: 11875,
    precioAnterior: 12500,
    preventaHasta: "2026-11-30",
    incluye: ["Vuelo", "Traslados", "Todo incluido"],
    visita: []
  },
  {
    id: "planet-hollywood-cancun",
    nombre: "Planet Hollywood, Cancún",
    tipo: "playa",
    region: "Sureste",
    foto: "Cancún",
    lat: 21.16, lon: -86.85,
    duracion: "4 días, 3 noches",
    salidas: ["2027-09-15"],
    precio: 15925,
    precioAnterior: 17690,
    preventaHasta: "2026-12-31",
    incluye: ["Vuelo", "Traslados", "Todo incluido"],
    visita: []
  },
  hotelAcapulco("acapulco-playa-suites", "Playa Suites", 6765, 3370, "Todo incluido"),
  hotelAcapulco("acapulco-emporio", "Emporio", 5650, 2575, "Desayuno buffet"),
  hotelAcapulco("acapulco-krystal", "Krystal", 7490, 3400, "Todo incluido"),
  hotelAcapulco("acapulco-real-bananas", "Real Bananas", 6745, 3400, "Todo incluido")
];
