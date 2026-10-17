let arrayNombreGastos = [
  "Electricidad",
  "Agua",
  "Gas",
  "Internet",
  "Alquiler",
  "Supermercado",
  "Comunidad",
  "Seguro Hogar",
  "Ocio",
  "Tasa Basura",
];
let arrayGastos = [50, 30, 40, 35, 700, 150, 60, 25, 15, 20];

let seleccionados = [];

let dineroTotal = 0;

let totalPagosRealizados = 0;

let contadorPagos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function sumarGastos(i) {
  contadorPagos[i]++;
  dineroTotal += arrayGastos[i];
  totalPagosRealizados++;

  seleccionados.push(arrayGastos[i]);
}

function mostrarResumen() {
  let listaConceptos = [];

  for (let i = 0; i < arrayNombreGastos.length; i++) {
    if (contadorPagos[i] > 0) {
      listaConceptos.push({
        nombre: arrayNombreGastos[i],
        pagos: contadorPagos[i],
      });
    }
  }

  let totalGastos = seleccionados.reduce(
    (valorAnt, valorAct) => valorAnt + valorAct,
    0,
  );
  document.getElementById("resultadoResumen").innerHTML =
    "<p><strong>Total: " + totalGastos + " €</strong></p>";
}
