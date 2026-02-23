// [BLOQUE: Navegación Centralizada]
const navigateTo = (url) => {
    window.location.href = url;
};

document.addEventListener('DOMContentLoaded', () => {
    const routes = {
        'btnProductos': 'productos.html',
        'btnOrdenes': 'ordenes.html',
        'btnCrearOrden': 'crear_orden.html'
    };

    Object.entries(routes).forEach(([id, path]) => {
        document.getElementById(id)?.addEventListener('click', () => navigateTo(path));
    });
});
