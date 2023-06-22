function guardarProductos(productos) { 
    localStorage.setItem("productos",JSON.stringify(productos));
}

function obtenerProductos() {
    return JSON.parse(localStorage.getItem("productos")) || [];
}

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem("carrito",JSON.stringify(carrito));
}

function obtenerProductoSeleccionado() {
    return JSON.parse(sessionStorage.getItem("productoSeleccionado"));
}

function renderizarProductos(filtro) {
    let salida = "";
    filtro.forEach(producto => {
        const {imagen,nombre,precio,id} = producto;
        salida += `
        <div class="card col-11 col-sm-6 col-md-4 col-lg-3">
            <img src="${imagen}" class="card-img-top" alt="${nombre.toUpperCase()}">
            <div class="card-body text-start">
                <h3 class="card-title text-primary text-start">$${precio}</h3>
                <p class="card-text">${nombre.toUpperCase()}</p>
                <button onclick="seleccionarProducto(${id})" class="btn btn-primary w-100">Ver Producto</button>
            </div>
        </div>
        `;
    });
    document.getElementById("contenido").innerHTML = salida;
}

function seleccionarProducto(id) {
    let productos = obtenerProductos();
    let producto = productos.find(e => e.id === id);
    sessionStorage.setItem("productoSeleccionado",JSON.stringify(producto));
    location.href = "producto.html";
}

function renderizarProductoSeleccionado() {
    let producto = obtenerProductoSeleccionado();
    let {nombre,categoria,precio,imagen} = producto;
    let salida = `
    <div class="d-sm-flex col-11 align-items-center">
        <div class="col-12 col-sm-5 col-md-6 col-lg-5"> 
            <img class="img-fluid" src="${imagen}" alt="${nombre.toUpperCase()}"> 
        </div>
        <div class="col-12 col-sm-7 col-md-6 col-lg-7 pt-5 px-2 border">
            <div class="d-flex text-center flex-column"> 
                <button class="btn" onclick="renderizarProductos(${categoria})">${categoria.toUpperCase()}</button>
                <h2>${nombre.toUpperCase()}</h2>
                <h4 class="text-primary">$${precio}</h4>
                <h5 class="mt-3 small">CANTIDAD<h/5>
                <select title="Seleccione la cantidad de unidades para agregar al carrito" id="unidadesProducto">
                <option selected value="1">1</option>
                <option value="2">2</option>
                </select>
                <p id="unidadesDisponibles" class="mt-3 text-muted small"></p>
                <button onclick="consultarStock()" class="btn btn-primary d-block m-auto w-50 my-4"><i class="fa-solid fa-cart-shopping me-2"></i>AGREGAR</button>
            </div>
        </div>
    </div>`;
    document.getElementById("contenido").innerHTML = salida;
    document.getElementById("unidadesDisponibles").innerHTML = `${obtenerUnidadesDisponiblesSeleccion()} UNIDADES DISPONIBLES`;
}

function consultarStock() {
    let unidadesDisponibles = obtenerUnidadesDisponiblesSeleccion();
    let unidadesSeleccionadas = obtenerUnidadesSeleccionadas();
    if (unidadesDisponibles === 0) {
        notificacionSinStock();
    } else if (unidadesDisponibles < unidadesSeleccionadas) {
        notificacionStockInsuficiente();
    } else {
        agregarAlCarrito(unidadesSeleccionadas);
    }
}

function obtenerUnidadesSeleccionadas() {
    return document.getElementById("unidadesProducto").value;
}

function obtenerUnidadesDisponiblesSeleccion() {
    let productos = obtenerProductos();
    let posicion = productos.findIndex(e => e.id == obtenerProductoSeleccionado().id);
    return productos[posicion].cantidad;
}

function eliminarUnidadProducto() {
    let productos = obtenerProductos();
    let idProducto = obtenerProductoSeleccionado().id;
    let posicionEnProductos = productos.findIndex(e => e.id === idProducto);
    productos[posicionEnProductos].cantidad--;
    guardarProductos(productos);
}