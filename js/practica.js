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

function sumarGastos(i) {
  seleccionados.push(arrayGastos[i]);
}

function mostrarResumen() {
  let totalGastos = seleccionados.reduce(
    (valorAnt, valorAct) => valorAnt + valorAct,
    0,
  );
  document.getElementById("resultadoResumen").innerHTML =
    "<p><strong>Total: " + totalGastos + " €</strong></p>";
}