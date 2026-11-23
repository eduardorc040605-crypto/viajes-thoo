/* =========================================================
   Utilidades: pequeñas funciones que usa el resto del código
   ========================================================= */

/* ---------- Atajos para el HTML ---------- */

// Busca un elemento de la página
const $ = (selector) => document.querySelector(selector);

// Crea un elemento: crear("p", { className: "texto" }, "Hola", otroElemento)
function crear(etiqueta, propiedades = {}, ...hijos) {
  const elemento = Object.assign(document.createElement(etiqueta), propiedades);
  elemento.append(...hijos.filter(Boolean));   // ignora los hijos vacíos
  return elemento;
}

/* ---------- WhatsApp ---------- */

// Enlace que abre un chat con el mensaje ya escrito
function enlaceWhatsApp(mensaje) {
  return `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/* ---------- Dinero y fechas ---------- */

const dinero = (cantidad) =>
  cantidad.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

// Convierte "2027-03-19" en fecha (al mediodía, para evitar saltos por zona horaria)
const fechaDe = (iso) => new Date(`${iso}T12:00:00`);

// El día de hoy, sin hora
function hoy() {
  const fecha = new Date();
  fecha.setHours(0, 0, 0, 0);
  return fecha;
}

const fechaCorta = (iso) => fechaDe(iso).toLocaleDateString("es-MX", { day: "numeric", month: "short" });
const fechaLarga = (iso) => fechaDe(iso).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

// "2027-03" -> "Marzo de 2027"
function nombreDeMes(mesIso) {
  const texto = fechaDe(`${mesIso}-01`).toLocaleDateString("es-MX", { month: "long", year: "numeric" });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/* ---------- Íconos de redes sociales ---------- */

const ICONOS = {
  instagram: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.3" fill="currentColor"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.5 3h-3.1v12.1a2.9 2.9 0 1 1-2-2.7V9.2A6 6 0 1 0 16.5 15V9.4c1.2.8 2.5 1.3 4 1.3V7.6c-2.3-.2-3.7-1.700-4-4.600z"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 8.5V7c0-.7.2-1 1.1-1H17V3h-2.6C11.600 3 10.500 4.600 10.500 6.800v1.700H8v3h2.500V21H14v-9.500h2.500l.5-3z"/></svg>`
};
