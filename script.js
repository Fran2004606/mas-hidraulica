const botonesAbrirProductos = document.querySelectorAll(".abrir-productos");
const modalProductos = document.getElementById("modal-productos");
const cerrarModal = document.querySelector(".cerrar");

const buscadorProducto = document.getElementById("buscar-producto");
const contenedorProductos = document.getElementById("contenedor-productos");
const limpiarFiltros = document.getElementById("limpiar-filtros");
const sinResultados = document.getElementById("sin-resultados");

const SUPABASE_URL = "https://nniletbqllbxmnplmgty.supabase.co";
const SUPABASE_KEY = "sb_publishable_MdLdxiIXTwOwsr4DYI91mw_JZjKuzAF";

const clienteSupabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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

    clienteSupabase
        .from("productos")
        .select("nombre, descripcion, imagen")
        .eq("activo", true)
        .order("nombre")
        .then(function(resultado){

            if(resultado.error){
                throw resultado.error;
            }

            productosCatalogo = (resultado.data || [])
                .map(function(fila){
                    return {
                        nombre: fila.nombre || "",
                        descripcion: fila.descripcion || "",
                        imagen: fila.imagen || ""
                    };
                })
                .filter(function(producto){
                    return producto.nombre.trim() !== "";
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