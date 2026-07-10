const botonesAbrirProductos = document.querySelectorAll(".abrir-productos");
const modalProductos = document.getElementById("modal-productos");
const cerrarModal = document.querySelector(".cerrar");

const buscadorProducto = document.getElementById("buscar-producto");
const tarjetasProductos = document.querySelectorAll(".productos-card");
const botonesCategoria = document.querySelectorAll(".categoria-btn");
const botonesMedida = document.querySelectorAll(".medida-btn");
const botonesMarca = document.querySelectorAll(".marca-btn");
const limpiarFiltros = document.getElementById("limpiar-filtros");
const sinResultados = document.getElementById("sin-resultados");

let categoriaActual = "todos";
let medidaActual = "todas";
let marcaActual = "todas";

botonesAbrirProductos.forEach(function(boton){
    boton.addEventListener("click", function(evento){
        evento.preventDefault();

        modalProductos.classList.add("abierto");
        document.body.style.overflow = "hidden";
    });
});

cerrarModal.addEventListener("click", function(){
    modalProductos.classList.remove("abierto");
    document.body.style.overflow = "";
});

modalProductos.addEventListener("click", function(evento){
    if(evento.target === modalProductos){
        modalProductos.classList.remove("abierto");
        document.body.style.overflow = "";
    }
});

function aplicarFiltros(){
    const textoBuscado = buscadorProducto.value.toLowerCase();

    let productosVisibles = 0;

    tarjetasProductos.forEach(function(tarjeta){
        const nombreProducto = tarjeta.dataset.nombre.toLowerCase();
        const categoriaProducto = tarjeta.dataset.categoria;
        const medidaProducto = tarjeta.dataset.medida;
        const marcaProducto = tarjeta.dataset.marca;

        const coincideTexto = nombreProducto.includes(textoBuscado);
        const coincideCategoria = categoriaActual === "todos" || categoriaProducto === categoriaActual;
        const coincideMedida = medidaActual === "todas" || medidaProducto === medidaActual;
        const coincideMarca = marcaActual === "todas" || marcaProducto === marcaActual;

        if(coincideTexto && coincideCategoria && coincideMedida && coincideMarca){
            tarjeta.style.display = "";
            productosVisibles++;
        } else {
            tarjeta.style.display = "none";
        }
    });

    if(productosVisibles === 0){
        sinResultados.style.display = "block";
    } else {
        sinResultados.style.display = "none";
    }
}

buscadorProducto.addEventListener("input", function(){
    aplicarFiltros();
});

botonesCategoria.forEach(function(boton){
    boton.addEventListener("click", function(){

        botonesCategoria.forEach(function(botonCategoria){
            botonCategoria.classList.remove("activo-filtro");
        });

        boton.classList.add("activo-filtro");

        categoriaActual = boton.dataset.categoria;

        aplicarFiltros();
    });
});

botonesMedida.forEach(function(boton){
    boton.addEventListener("click", function(){

        botonesMedida.forEach(function(botonMedida){
            botonMedida.classList.remove("activo-filtro");
        });

        boton.classList.add("activo-filtro");

        medidaActual = boton.dataset.medida;

        aplicarFiltros();
    });
});

botonesMarca.forEach(function(boton){
    boton.addEventListener("click", function(){

        botonesMarca.forEach(function(botonMarca){
            botonMarca.classList.remove("activo-filtro");
        });

        boton.classList.add("activo-filtro");

        marcaActual = boton.dataset.marca;

        aplicarFiltros();
    });
});

limpiarFiltros.addEventListener("click", function(){

    buscadorProducto.value = "";

    categoriaActual = "todos";
    medidaActual = "todas";
    marcaActual = "todas";

    botonesCategoria.forEach(function(boton){
        boton.classList.remove("activo-filtro");
    });

    botonesMedida.forEach(function(boton){
        boton.classList.remove("activo-filtro");
    });

    botonesMarca.forEach(function(boton){
        boton.classList.remove("activo-filtro");
    });

    document.querySelector('.categoria-btn[data-categoria="todos"]').classList.add("activo-filtro");
    document.querySelector('.medida-btn[data-medida="todas"]').classList.add("activo-filtro");
    document.querySelector('.marca-btn[data-marca="todas"]').classList.add("activo-filtro");

    aplicarFiltros();
});

tarjetasProductos.forEach(function(tarjeta){
    const nombreProducto = tarjeta.querySelector("p").textContent.trim();
    const botonConsulta = tarjeta.querySelector(".boton-producto");

    const mensaje = `Hola, quisiera consultar por ${nombreProducto}`;

    botonConsulta.href = `https://wa.me/5493462661376?text=${encodeURIComponent(mensaje)}`;
    botonConsulta.target = "_blank";
});