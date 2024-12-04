let mostrador = document.getElementById("mostrador");
let seleccion = document.getElementById("seleccion");
let imgSeleccionada = document.getElementById("img");
let modeloSeleccionado = document.getElementById("modelo");
let descripSeleccionada = document.getElementById("descripcion");

// Variable para almacenar el valor seleccionado
let valorSeleccionado = '';

function cargar(item) {
    quitarBordes();

    // Expandir la sección de selección
    mostrador.style.width = "100%";
    seleccion.style.width = "40%";
    seleccion.style.opacity = "1";

    // Resaltar el borde del item seleccionado
    item.style.border = "2px solid #13678A";

    // Cargar detalles de la tarjeta seleccionada
    imgSeleccionada.src = item.getElementsByTagName("img")[0].src;
    modeloSeleccionado.innerHTML = item.getElementsByTagName("p")[0].innerHTML;
    descripSeleccionada.innerHTML = "Descripción del modelo";

    // Obtener el valor de suscripción desde el atributo data-valor
    valorSeleccionado = item.getAttribute("data-valor");
    console.log("Valor seleccionado:", valorSeleccionado);
}

function cerrar() {
    mostrador.style.width = "100%";
    seleccion.style.width = "0%";
    seleccion.style.opacity = "0";
    quitarBordes();
}

function quitarBordes() {
    var items = document.getElementsByClassName("item");
    for (let i = 0; i < items.length; i++) {
        items[i].style.border = "none";
    }
}

// Capturar el evento de clic del botón de suscribirse
document.getElementById("suscripcion-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir envío predeterminado del formulario

    if (valorSeleccionado) {
        // Redirigir a la ruta con el valor seleccionado
        window.location.href = window.location.href + `/${valorSeleccionado}/encuesta`;
    } else {
        alert("Por favor selecciona una categoría antes de suscribirte.");
    }
});
