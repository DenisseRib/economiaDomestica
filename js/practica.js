let arrayNombreGastos = ["Electricidad", "Agua", "Gas", "Internet", "Alquiler", "Supermercado", "Comunidad", "Seguro Hogar", "Ocio", "Tasa Basura"];
let arrayGastos = [50, 30, 40, 35, 700, 150, 60, 25, 15, 20];

let sumaGastos = 0;

const imagenesGastos = document.querySelectorAll('.gasto-img');
const spanTotal = document.getElementById('total');

imagenesGastos.forEach((imagen) => {
    imagen.addEventListener('click', (evento) => {
       
        let indice = parseInt(evento.target.getAttribute('data-index'));
        
        
        let valorGasto = arrayGastos[indice];
        sumaGastos += valorGasto;
        
        console.log(`Has hecho clic en: ${arrayNombreGastos[indice]} (+${valorGasto}€)`);
        console.log(`Suma actual: ${sumaGastos}€`);
        
        
        spanTotal.textContent = sumaGastos;
    });
});