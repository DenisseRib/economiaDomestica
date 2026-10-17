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
let resumenMostrado = false;

function sumarGastos(i) {
    if (resumenMostrado) {
        document.getElementById("resultadoResumen").innerHTML = "";
        resumenMostrado = false;
    }
  contadorPagos[i]++;
  dineroTotal += arrayGastos[i];
  totalPagosRealizados++;

  seleccionados.push(arrayGastos[i]);
}

function mostrarResumen() {
  let listaConceptos = [];
  if (totalPagosRealizados === 0) {
    document.getElementById("resultadoResumen").innerHTML = "<p>No se ha registrado ningún pago</p>";
    return; 
}

  for (let i = 0; i < arrayNombreGastos.length; i++) {
    if (contadorPagos[i] > 0) {
      listaConceptos.push({
        nombre: arrayNombreGastos[i],
        pagos: contadorPagos[i],
      });
    }
  }
  listaConceptos.sort(function (a, b) {
    if (b.pagos !== a.pagos) {
      return b.pagos - a.pagos;
    } else {
      return a.nombre.localeCompare(b.nombre);
    }
  });

  let totalGastos = seleccionados.reduce(
    (valorAnt, valorAct) => valorAnt + valorAct,
    0,
  );

  let resultadoHTML = "";

  listaConceptos.forEach(function (item) {
    resultadoHTML += "<p>" + item.nombre + " - " + item.pagos + " pago(s)</p>";
  });

  resultadoHTML +=
    "<hr><p><strong>Gasto final: " + dineroTotal + " €</strong></p>";

  let gastoMedio = 0;

  if (totalPagosRealizados > 0) {
    gastoMedio = dineroTotal / totalPagosRealizados;
  }

  resultadoHTML +=
    "<p><strong>Gasto medio por pago: " + gastoMedio + " €</strong></p>";

  document.getElementById("resultadoResumen").innerHTML = resultadoHTML;
  resumenMostrado = true;
  
  contadorPagos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    dineroTotal = 0;
    totalPagosRealizados = 0;
}
