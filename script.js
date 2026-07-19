const botonesAbrirProductos = document.querySelectorAll(".abrir-productos, #abrir-productos");
const modalProductos = document.getElementById("modal-productos");
const cerrarModal = document.querySelector(".cerrar");

const buscadorProducto = document.getElementById("buscar-producto");
const contenedorProductos = document.getElementById("contenedor-productos");
const limpiarFiltros = document.getElementById("limpiar-filtros");
const sinResultados = document.getElementById("sin-resultados");

const URL_CATALOGO = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSxD4qcQbaNJIIkQA4qzspyeYG_HL1cT_vNKfeGeScnutyZLan4d7L1fzKeawyKrM3s-nLrCFU0xDOV/pub?gid=1131149414&single=true&output=csv";

const detalleProducto = document.getElementById("detalle-producto");
const cerrarDetalle = document.getElementById("cerrar-detalle");

const detalleNombre = document.getElementById("detalle-nombre");
const detalleDescripcion = document.getElementById("detalle-descripcion");
const detalleImagen = document.getElementById("detalle-imagen");
const detalleConsultar = document.getElementById("detalle-consultar");


let productosCatalogo = [];

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

function separarCSV(texto){
    const filas = [];

    let filaActual = [];
    let valorActual = "";
    let dentroDeComillas = false;

    for(let i = 0; i < texto.length; i++){
        const caracter = texto[i];
        const siguiente = texto[i + 1];

        if(caracter === '"'){

            if(dentroDeComillas && siguiente === '"'){
                valorActual += '"';
                i++;
            } else {
                dentroDeComillas = !dentroDeComillas;
            }

        } else if(caracter === "," && !dentroDeComillas){

            filaActual.push(valorActual.trim());
            valorActual = "";

        } else if(
            (caracter === "\n" || caracter === "\r") &&
            !dentroDeComillas
        ){

            if(caracter === "\r" && siguiente === "\n"){
                i++;
            }

            filaActual.push(valorActual.trim());
            valorActual = "";

            const filaTieneContenido = filaActual.some(function(valor){
                return valor !== "";
            });

            if(filaTieneContenido){
                filas.push(filaActual);
            }

            filaActual = [];

        } else {
            valorActual += caracter;
        }
    }

    if(valorActual !== "" || filaActual.length > 0){

        filaActual.push(valorActual.trim());

        const filaTieneContenido = filaActual.some(function(valor){
            return valor !== "";
        });

        if(filaTieneContenido){
            filas.push(filaActual);
        }
    }

    return filas;
}

function convertirLinkDrive(url){
    if(!url){
        return "";
    }

    let idImagen = "";

    if(url.includes("id=")){
        idImagen = url.split("id=")[1].split("&")[0];
    } else if(url.includes("/d/")){
        idImagen = url.split("/d/")[1].split("/")[0];
    }

    if(!idImagen){
        return url;
    }

    return `https://drive.google.com/thumbnail?id=${idImagen}&sz=w1000`;
}


function abrirDetalleProducto(producto){

    if(
        !detalleProducto ||
        !detalleNombre ||
        !detalleDescripcion ||
        !detalleImagen ||
        !detalleConsultar
    ){
        console.error("Faltan elementos del detalle de producto en el HTML");
        return;
    }

    detalleNombre.textContent = producto.nombre;
    detalleDescripcion.textContent = producto.descripcion;

    detalleImagen.src = producto.imagen;
    detalleImagen.alt = producto.nombre;

    const mensajeWhatsapp =
        `Hola, quisiera consultar por ${producto.nombre}`;

    detalleConsultar.href =
        `https://wa.me/5493462661376?text=${encodeURIComponent(mensajeWhatsapp)}`;

    detalleProducto.classList.add("abierto");
    detalleProducto.setAttribute("aria-hidden", "false");
}

function cerrarDetalleProducto(){

    detalleProducto.classList.remove("abierto");
    detalleProducto.setAttribute("aria-hidden", "true");

    detalleImagen.src = "";
}

if(cerrarDetalle){
    cerrarDetalle.addEventListener("click", function(){
        cerrarDetalleProducto();
    });
}

function crearTarjetaProducto(producto){

    const articulo = document.createElement("article");
    articulo.classList.add("productos-card");

    const imagen = document.createElement("img");
    imagen.src = producto.imagen;
    imagen.alt = producto.nombre;

    const nombre = document.createElement("p");
    nombre.classList.add("nombre-producto");
    nombre.textContent = producto.nombre;

    const botonVer = document.createElement("button");
    botonVer.type = "button";
    botonVer.classList.add("ver-producto");
    botonVer.textContent = "Ver producto";

    botonVer.addEventListener("click", function(){
        abrirDetalleProducto(producto);
    });

    articulo.appendChild(imagen);
    articulo.appendChild(nombre);
    articulo.appendChild(botonVer);

    contenedorProductos.appendChild(articulo);
}

function mostrarProductos(productos){

    contenedorProductos.innerHTML = "";

    if(productos.length === 0){

        sinResultados.style.display = "block";
        contenedorProductos.appendChild(sinResultados);

        return;
    }

    productos.forEach(function(producto){
        crearTarjetaProducto(producto);
    });

    sinResultados.style.display = "none";
    contenedorProductos.appendChild(sinResultados);
}

function cargarCatalogo(){

    fetch(URL_CATALOGO)
        .then(function(respuesta){

            if(!respuesta.ok){
                throw new Error("No se pudo cargar la planilla");
            }

            return respuesta.text();
        })
        .then(function(datos){

            const filas = separarCSV(datos);

            if(filas.length === 0){
                mostrarProductos([]);
                return;
            }

            const encabezados = filas[0].map(function(encabezado){
                return encabezado.trim().toLowerCase();
            });

            const indiceNombre =
                encabezados.indexOf("nombre del producto");

            const indiceDescripcion =
                encabezados.indexOf("descripción breve");

            const indiceImagen =
                encabezados.indexOf("foto del producto");

            const indiceActivo =
                encabezados.indexOf("activo");

            if(
                indiceNombre === -1 ||
                indiceDescripcion === -1 ||
                indiceImagen === -1 ||
                indiceActivo === -1
            ){
                throw new Error(
                    "No se encontraron las columnas necesarias en la planilla"
                );
            }

            productosCatalogo = filas
                .slice(1)
                .map(function(columnas){

                    const valorActivo =
                        String(columnas[indiceActivo] || "")
                            .trim()
                            .toUpperCase();

                    return {
                        nombre: columnas[indiceNombre] || "",

                        descripcion:
                            columnas[indiceDescripcion] || "",

                        imagen: convertirLinkDrive(
                            columnas[indiceImagen] || ""
                        ),

                        activo:
                            valorActivo === "TRUE" ||
                            valorActivo === "VERDADERO"
                    };
                })
                .filter(function(producto){

                    return (
                        producto.activo &&
                        producto.nombre.trim() !== ""
                    );
                });

            mostrarProductos(productosCatalogo);
        })
        .catch(function(error){

            console.error(
                "Error al cargar el catálogo:",
                error
            );

            mostrarProductos([]);
        });
}

buscadorProducto.addEventListener("input", function(){
    const textoBuscado = buscadorProducto.value.toLowerCase();

    const productosFiltrados = productosCatalogo.filter(function(producto){
        const nombre = producto.nombre.toLowerCase();
        const descripcion = producto.descripcion.toLowerCase();

        return nombre.includes(textoBuscado) || descripcion.includes(textoBuscado);
    });

    mostrarProductos(productosFiltrados);
});

limpiarFiltros.addEventListener("click", function(){
    buscadorProducto.value = "";
    mostrarProductos(productosCatalogo);
});

cargarCatalogo();

const slidesNosotros = document.querySelectorAll(".slide-nosotros");

let slideActual = 0;

function cambiarSlideNosotros(){
    slidesNosotros[slideActual].classList.remove("activo-slide");

    slideActual++;

    if(slideActual >= slidesNosotros.length){
        slideActual = 0;
    }

    slidesNosotros[slideActual].classList.add("activo-slide");
}

setInterval(cambiarSlideNosotros, 3000);
