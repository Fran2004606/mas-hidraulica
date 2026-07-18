const botonesAbrirProductos = document.querySelectorAll(".abrir-productos, #abrir-productos");
const modalProductos = document.getElementById("modal-productos");
const cerrarModal = document.querySelector(".cerrar");

const buscadorProducto = document.getElementById("buscar-producto");
const contenedorProductos = document.getElementById("contenedor-productos");
const limpiarFiltros = document.getElementById("limpiar-filtros");
const sinResultados = document.getElementById("sin-resultados");

const URL_CATALOGO = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSxD4qcQbaNJIIkQA4qzspyeYG_HL1cT_vNKfeGeScnutyZLan4d7L1fzKeawyKrM3s-nLrCFU0xDOV/pub?gid=1131149414&single=true&output=csv";

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

function separarCSV(linea){
    const columnas = [];
    let valorActual = "";
    let dentroDeComillas = false;

    for(let i = 0; i < linea.length; i++){
        const caracter = linea[i];

        if(caracter === '"'){
            dentroDeComillas = !dentroDeComillas;
        } else if(caracter === "," && !dentroDeComillas){
            columnas.push(valorActual.trim());
            valorActual = "";
        } else {
            valorActual += caracter;
        }
    }

    columnas.push(valorActual.trim());

    return columnas;
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

function crearTarjetaProducto(producto){
    const articulo = document.createElement("article");
    articulo.classList.add("productos-card");

    const mensajeWhatsapp = `Hola, quisiera consultar por ${producto.nombre}`;

    articulo.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">

        <p class="nombre-producto">${producto.nombre}</p>

        <span class="descripcion-producto">
            ${producto.descripcion}
        </span>

        <a 
            href="https://wa.me/5493462661376?text=${encodeURIComponent(mensajeWhatsapp)}" 
            class="boton-producto"
            target="_blank"
        >
            Consultar
        </a>
    `;

    contenedorProductos.appendChild(articulo);
}

function mostrarProductos(productos){
    contenedorProductos.innerHTML = "";

    if(productos.length === 0){
        contenedorProductos.appendChild(sinResultados);
        sinResultados.style.display = "block";
        return;
    }

    productos.forEach(function(producto){
        crearTarjetaProducto(producto);
    });

    contenedorProductos.appendChild(sinResultados);
    sinResultados.style.display = "none";
}

function cargarCatalogo(){
    fetch(URL_CATALOGO)
        .then(function(respuesta){
            return respuesta.text();
        })
        .then(function(datos){
            const lineas = datos.trim().split("\n");

            productosCatalogo = lineas.slice(1).map(function(linea){
                const columnas = separarCSV(linea);

                return {
                    nombre: columnas[1] || "",
                    descripcion: columnas[2] || "",
                    imagen: convertirLinkDrive(columnas[3] || ""),
                    activo: columnas[4] === "TRUE"
                };
            }).filter(function(producto){
                return producto.activo && producto.nombre !== "";
            });

            mostrarProductos(productosCatalogo);
        })
        .catch(function(error){
            console.log("Error al cargar el catálogo:", error);
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