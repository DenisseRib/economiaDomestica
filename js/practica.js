const URL = "http://localhost:8080";   // o 8080 si usas el zip
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
async function iniciar() {
  try {
    const response = await fetch(URL + "/conceptos");
    if (!response.ok) {
      throw new Error("Error al cargar los conceptos: " + response.status);
    }
    conceptos = await response.json();
    mostrarConceptos();
    iniciarTramite();
  } catch (error) {
    console.error("Error al iniciar la aplicación:", error);
    alert("Error al iniciar la aplicación. Por favor, inténtelo de nuevo más tarde.");
  }
}

function mostrarConceptos() {
  const grid = document.getElementById("gridConceptos");
  grid.innerHTML = "";
  conceptos.forEach((concepto) => {
    const card = document.createElement("div");
    card.className = "tarjeta";
    card.innerHTML = `
      <img src="${concepto.imagen}" alt="${concepto.nombre}" onclick="agregarPago(${concepto.id})">
      <h3>${concepto.nombre}</h3>
      <input type="number" id="importe${concepto.id}" min="0" step="0.01" placeholder="Importe (€)">
    `;
    grid.appendChild(card);
  });
}

function iniciarTramite() {
  const mesTexto = prompt("Indica el mes del trámite (1-12):");
  const mes = Number(mesTexto);
  const anioTexto = prompt("Indica el año del trámite:");
  const anio = Number(anioTexto);

  if (!Number.isInteger(mes) || mes < 1 || mes > 12 || !Number.isInteger(anio) || anio < 1) {
    alert("Debe indicar un mes y un año válidos.");
    iniciarTramite();
    return;
  }

  tramite = { mes, anio, pagos: [] };
  pagos = [];
  finalizado = false;

  let mesFormateado = mes;
  if (mes < 10) {
    mesFormateado = "0" + mes;
  }

  document.getElementById("datoTramite").textContent = "Trámite: " + mesFormateado + "/" + anio;
  document.getElementById("btnFinalizar").disabled = false;
}
function agregarPago(conceptoId) {
  const concepto = conceptos.find((c) => c.id === conceptoId);
  if (!concepto) {
    alert("Concepto no encontrado.");
    return;
  }
  const importeInput = document.getElementById("importe" + conceptoId);
  const importe = Number(importeInput.value);
  if (isNaN(importe) || importe <= 0) {
    alert("Debe indicar un importe válido.");
    return;
  }
  pagos.push({ concepto, importe });
  pintarPagos(concepto, importe);
}
function pintarPagos(concepto, importe) {
  const listaPagos = document.getElementById("listaPagos");
  const linea = document.createElement("lista-pagos");
  linea.dataset.concepto = concepto.nombre;
  linea.textContent = concepto.nombre + ": " + importe.toFixed(2) + " €";
  listaPagos.appendChild(linea);
  listaPagos.scrollTop = listaPagos.scrollHeight;
  listaPagos.querySelectorAll(".linea-pago").forEach((item) => {
    item.classList = "lineaPagos";
  });
}

window.onload = iniciar;