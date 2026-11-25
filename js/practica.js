const API_URL = "http://localhost:3000";
const RAIZ_PROYECTO = new URL("../", document.currentScript.src);
const DATOS_LOCALES_URL = new URL("data/ecoDomestica.json", RAIZ_PROYECTO);
let conceptos = [];
let tramite = null;
let pagos = [];
let tramitesGuardados = [];
let tramiteFinalizado = false;
let temporizadorLimpieza = null;

const categorias = {
  CULT: "Cultura",
  ALI: "Alimentación",
  DEP: "Deportes",
  OC: "Ocio",
  S_BAS: "Servicios Básicos",
};
function iniciarTramite(evento) {
  evento.preventDefault();

  const mesInput = document.getElementById("mesTramite");
  const anioInput = document.getElementById("anioTramite");
  const mensajeError = document.getElementById("errorTramite");
  if (tramiteFinalizado) {
    mensajeError.textContent = "Espera a que termine la limpieza del trámite finalizado.";
    return;
  }

  const mes = Number(mesInput.value);
  const anio = Number(anioInput.value);

  if (!Number.isInteger(mes) || mes < 1 || mes > 12) {
    mensajeError.textContent = "Indica un mes válido entre 1 y 12.";
    mesInput.focus();
    return;
  }

  if (!Number.isInteger(anio) || anio < 1 || anio > 9999) {
    mensajeError.textContent = "Indica un año válido.";
    anioInput.focus();
    return;
  }

  pagos = [];
  tramite = { mes, anio, pagos };
  tramiteFinalizado = false;
  mensajeError.textContent = "";

  const mesFormateado = String(mes).padStart(2, "0");

  document.getElementById("datoTramite").textContent =
    "Trámite: " + mesFormateado + "/" + anio;
}

async function obtenerDatos(url) {
  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error(`Error al cargar ${url}: ${respuesta.status}`);
  }
  return respuesta.json();
}

async function cargarConceptos() {
  let conceptosCargados;

  try {
    conceptosCargados = await obtenerDatos(`${API_URL}/conceptos`);
    if (!Array.isArray(conceptosCargados)) {
      throw new Error("La API no devolvió una lista de conceptos.");
    }
  } catch (errorApi) {
    try {
      const datosLocales = await obtenerDatos(DATOS_LOCALES_URL);
      conceptosCargados = datosLocales.conceptos;
      if (!Array.isArray(conceptosCargados)) {
        throw new Error("El archivo local no contiene una lista de conceptos.");
      }
    } catch (errorLocal) {
      console.error("No se pudieron cargar los conceptos.", {
        errorApi,
        errorLocal,
      });
      alert("No se pudieron cargar los conceptos. Comprueba el servidor y vuelve a intentarlo.");
      return;
    }
  }

  conceptos = conceptosCargados;
  mostrarConceptos();
}

function mostrarConceptos() {
  const grid = document.getElementById("gridConceptos");
  const tarjetas = document.createDocumentFragment();

  conceptos.forEach((concepto) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";

    const imagen = document.createElement("img");
    imagen.src = new URL(concepto.img, RAIZ_PROYECTO).href;
    imagen.alt = concepto.nombre;
    imagen.dataset.id = concepto.id;
    imagen.title = `Registrar pago de ${concepto.nombre}`;
    imagen.addEventListener("click", () => {
      registrarPago(concepto.id, imagen);
    });

    const nombre = document.createElement("h3");
    nombre.textContent = concepto.nombre;

    const importe = document.createElement("input");
    importe.className = "importe-pago";
    importe.type = "number";
    importe.min = "0.01";
    importe.step = "0.01";
    importe.placeholder = "Importe €";
    importe.setAttribute("aria-label", `Importe de ${concepto.nombre}`);

    tarjeta.append(imagen, nombre, importe);
    tarjetas.appendChild(tarjeta);
  });

  grid.replaceChildren(tarjetas);
}

function registrarPago(conceptoId, imagen) {
  const concepto = conceptos.find((item) => String(item.id) === String(conceptoId));
  const importeInput = imagen.closest(".tarjeta").querySelector(".importe-pago");
  const mensaje = document.getElementById("mensajePago");

  if (tramiteFinalizado) {
    mensaje.textContent = "El trámite ya ha finalizado.";
    return;
  }

  if (!tramite) {
    mensaje.textContent = "Primero debes iniciar un trámite indicando el mes y el año.";
    return;
  }

  const importe = Number(importeInput.value);
  if (!Number.isFinite(importe) || importe <= 0) {
    mensaje.textContent = "No se puede registrar un pago: indica un importe mayor que 0.";
    importeInput.focus();
    return;
  }

  const pago = {
    conceptoId: concepto.id,
    concepto: concepto.nombre,
    importe,
  };
  pagos.push(pago);
  agregarAlHistorial(pago);
  importeInput.value = "";
  mensaje.textContent = `Pago de ${concepto.nombre} registrado: ${importe.toFixed(2)} €.`;
}

function agregarAlHistorial(pago) {
  const listaPagos = document.getElementById("listaPagos");
  const linea = document.createElement("p");
  linea.className = "linea-pago";
  linea.dataset.conceptoId = pago.conceptoId;
  linea.textContent = `${pago.concepto} ${pago.importe.toFixed(2)} €`;

  const lineasAnteriores = listaPagos.querySelectorAll(".linea-pago");
  lineasAnteriores.forEach((lineaAnterior) => {
    lineaAnterior.classList.remove("linea-pago--resaltada");
  });
  linea.classList.add("linea-pago--resaltada");

  const mensajeInicial = listaPagos.querySelector(".mensaje-historial-vacio");
  if (mensajeInicial) {
    mensajeInicial.remove();
  }
  listaPagos.appendChild(linea);
}

function finalizarTramite() {
  const resultado = document.getElementById("resultadoResumen");
  if (!tramite) {
    resultado.textContent = "Inicia un trámite antes de consultar el resumen.";
    return;
  }
  if (tramiteFinalizado) {
    return;
  }

  tramiteFinalizado = true;
  const fechaFinalizacion = new Date();
  const lineaFecha = document.createElement("p");
  lineaFecha.textContent =
    `Trámite finalizado: ${fechaFinalizacion.toLocaleString("es-ES")}`;
  resultado.replaceChildren(lineaFecha);

  const resumenPorConcepto = new Map();
  pagos.forEach((pago) => {
    const datosConcepto = resumenPorConcepto.get(pago.conceptoId) || {
      concepto: pago.concepto,
      cantidadPagos: 0,
      importeTotal: 0,
    };
    datosConcepto.cantidadPagos += 1;
    datosConcepto.importeTotal += pago.importe;
    resumenPorConcepto.set(pago.conceptoId, datosConcepto);
  });

  resumenPorConcepto.forEach((datosConcepto) => {
    const lineaConcepto = document.createElement("p");
    const importeMedio = datosConcepto.importeTotal / datosConcepto.cantidadPagos;
    const textoCantidadPagos =
      datosConcepto.cantidadPagos === 1 ? "1 pago" : `${datosConcepto.cantidadPagos} pagos`;
    lineaConcepto.textContent =
      `${datosConcepto.concepto}: ${textoCantidadPagos}, ` +
      `importe medio ${importeMedio.toFixed(2)} €, ` +
      `importe total ${datosConcepto.importeTotal.toFixed(2)} €.`;
    resultado.appendChild(lineaConcepto);
  });

  mostrarDetalleConceptos();

  temporizadorLimpieza = setTimeout(() => {
    const tramiteGuardado = {
      mes: tramite.mes,
      anio: tramite.anio,
      fechaFinalizacion: fechaFinalizacion.toISOString(),
      pagos: pagos.map((pago) => ({ ...pago })),
    };
    tramitesGuardados.push(tramiteGuardado);
    guardarTramite(tramiteGuardado);
    limpiarTramite();
  }, 10000);
}

async function guardarTramite(tramiteGuardado) {
  try {
    const respuesta = await fetch(`${API_URL}/registros`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tramiteGuardado),
    });
    if (!respuesta.ok) {
      throw new Error(`Error al guardar el trámite: ${respuesta.status}`);
    }
  } catch (error) {
    console.error("No se pudo guardar el trámite en el servidor.", error);
    alert("No se pudo guardar el trámite en el servidor.");
  }
}

function limpiarTramite() {
  document.getElementById("listaPagos").replaceChildren(
    crearMensajeHistorialVacio(),
  );
  document.getElementById("resultadoResumen").replaceChildren();
  document.getElementById("detalleConceptos").replaceChildren();
  document.getElementById("ventanaDetalle").close();
  document.getElementById("mensajePago").textContent = "";
  document.querySelectorAll(".importe-pago").forEach((input) => {
    input.value = "";
  });
  document.getElementById("datoTramite").textContent =
    "Introduce el mes y el año para iniciar el trámite.";
  document.getElementById("mesTramite").value = "";
  document.getElementById("anioTramite").value = "";

  pagos = [];
  tramite = null;
  tramiteFinalizado = false;
  temporizadorLimpieza = null;
}

function crearMensajeHistorialVacio() {
  const mensaje = document.createElement("p");
  mensaje.className = "mensaje-historial-vacio";
  mensaje.textContent = "Los pagos registrados aparecerán aquí.";
  return mensaje;
}

function mostrarDetalleConceptos() {
  const detalle = document.getElementById("detalleConceptos");
  const idsConceptosPagados = new Set(pagos.map((pago) => String(pago.conceptoId)));
  detalle.replaceChildren();

  conceptos.forEach((concepto) => {
    if (!idsConceptosPagados.has(String(concepto.id))) {
      return;
    }

    const linea = document.createElement("p");
    const tipoGasto = concepto.imprescindible ? "imprescindible" : "prescindible";
    linea.textContent =
      `${concepto.nombre} es un gasto ${tipoGasto} de categoría ${categorias[concepto.categoria]}.`;
    detalle.appendChild(linea);
  });

  document.getElementById("ventanaDetalle").showModal();
}

document
  .getElementById("formTramite")
  .addEventListener("submit", iniciarTramite);

document
  .getElementById("btnCerrarDetalle")
  .addEventListener("click", () => {
    document.getElementById("ventanaDetalle").close();
  });

document
  .getElementById("btnFinalizar")
  .addEventListener("click", finalizarTramite);

cargarConceptos();
