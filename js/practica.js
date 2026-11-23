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