/* =========================================================
   Datos del negocio
   Aquí se cambia el teléfono, las redes y los mensajes
   rápidos del botón de WhatsApp.
   ========================================================= */

const NEGOCIO = {
  nombre: "Los Viajes de Thoo",
  lema: "Viajes grupales desde CDMX",
  frase: "Viaja, disfruta y déjanos ayudar a hacerlo realidad.",
  telefono: "56 4735 5854",
  whatsapp: "525647355854",   // lada de país (52) + número, sin + ni espacios

  redes: {
    instagram: "https://www.instagram.com/losviajesdethoo/",
    tiktok: "https://www.tiktok.com/@losviajesdethoo_",
    facebook: "https://www.facebook.com/profile.php?id=61581704138993"
  }
};

// Opciones del menú del botón flotante: [texto del botón, mensaje que se envía]
const MENSAJES_RAPIDOS = [
  ["Cotizar un viaje", "Hola, quiero cotizar un viaje grupal desde CDMX. ¿Me pueden ayudar?"],
  ["Próximas salidas", "Hola, quiero conocer sus próximas salidas."],
  ["Promociones y pre-compra", "Hola, ¿qué promociones y precios de pre-compra tienen disponibles?"],
  ["Hablar con un asesor", "Hola, me gustaría hablar con un asesor de viajes."]
];
