let conceptos = [];
let tramite = null;
let pagos = [];
let tramitesGuardados = [];

const categorias = {
  CULT: "Cultura",
  ALI: "Alimentación",
  DEP: "Deportes",
  OC: "Ocio",
  S_BAS: "Servicios Básicos",
};

function iniciarTramite() {
  const mesTexto = prompt("Indica el mes del trámite (1-12):");
  const mes = Number(mesTexto);
  const anioTexto = prompt("Indica el año del trámite:");
  const anio = Number(anioTexto);

  if (
    !Number.isInteger(mes) ||
    mes < 1 ||
    mes > 12 ||
    !Number.isInteger(anio) ||
    anio < 1
  ) {
    alert("Debe indicar un mes y un año válidos.");
    iniciarTramite();
    return;
  }

  tramite = { mes, anio, pagos: [] };
  pagos = [];

  let mesFormateado = mes;
  if (mes < 10) {
    mesFormateado = "0" + mes;
  }

  document.getElementById("datoTramite").textContent =
    "Trámite: " + mesFormateado + "/" + anio;
}

async function cargarConceptos() {
  try {
    const respuesta = await fetch("http://localhost:3000/conceptos");
    if (!respuesta.ok) throw new Error("json-server no disponible");
    conceptos = await respuesta.json();
  } catch (error) {
    const respuesta = await fetch("./data/ecoDomestica.json");
    conceptos = (await respuesta.json()).conceptos;
  }
  mostrarConceptos();
}

function mostrarConceptos() {
  const grid = document.getElementById("gridConceptos");
  grid.innerHTML = conceptos.map((concepto) => `
    <article class="tarjeta">
      <img src="${concepto.img}" alt="${concepto.nombre}" data-id="${concepto.id}" title="Registrar pago de ${concepto.nombre}">
      <h3>${concepto.nombre}</h3>
      <input class="importe-pago" type="number" min="0.01" step="0.01" placeholder="Importe €" aria-label="Importe de ${concepto.nombre}">
    </article>`).join("");
  grid.querySelectorAll("img").forEach((imagen) => imagen.addEventListener("click", () => registrarPago(imagen.dataset.id, imagen)));
}

cargarConceptos();