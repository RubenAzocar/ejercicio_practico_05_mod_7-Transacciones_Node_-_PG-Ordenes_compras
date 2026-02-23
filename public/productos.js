// [BLOQUE: Lógica de Productos]

/**
 * Carga y renderiza la lista de productos desde la API.
 */
const cargarProductos = async () => {
    const tableBody = document.getElementById('listaProductos');
    const loading = document.getElementById('loading');
    const container = document.getElementById('tableContainer');

    try {
        const response = await fetch('/api?filtro=productos');
        const productos = await response.json();

        tableBody.innerHTML = '';
        productos.forEach(p => {
            const tr = document.createElement('tr');
            const statusColor = p.stock > 10 ? 'var(--success)' : (p.stock > 0 ? '#f59e0b' : 'var(--danger)');
            const statusText = p.stock > 10 ? 'Disponible' : (p.stock > 0 ? 'Bajo Stock' : 'Agotado');

            tr.innerHTML = `
                <td style="font-weight: 600; color: var(--primary);">#${p.id}</td>
                <td>${p.nombre}</td>
                <td style="font-weight: 700;">${p.stock}</td>
                <td>
                    <span style="padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; background: ${statusColor}1A; color: ${statusColor}; border: 1px solid ${statusColor}33;">
                        ${statusText}
                    </span>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        loading.style.display = 'none';
        container.style.display = 'block';

    } catch (error) {
        console.error('Error fetching products:', error);
        document.getElementById('res').textContent = 'Error al cargar productos: ' + error.message;
    }
};

document.addEventListener('DOMContentLoaded', cargarProductos);
