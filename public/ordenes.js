// [BLOQUE: Lógica de Órdenes]

/**
 * Busca y renderiza las órdenes de un cliente por su RUT.
 */
const buscarOrdenes = async () => {
    const rut = document.getElementById('rut').value.trim();
    const resultsEl = document.getElementById('results');
    const resEl = document.getElementById('res');

    if (!rut) return alert('Por favor ingrese un RUT');

    try {
        resultsEl.innerHTML = '<p style="text-align:center;">Buscando...</p>';
        resEl.textContent = '';

        const response = await fetch(`/api?filtro=ordenes&rut=${encodeURIComponent(rut)}`);
        const data = await response.json();

        if (data.error) {
            resultsEl.innerHTML = '';
            resEl.textContent = `❌ Error: ${data.message || data.error}`;
            return;
        }

        if (Array.isArray(data) && data.length > 0) {
            resultsEl.innerHTML = `
                <table style="animation: fadeIn 0.3s ease-in;">
                    <thead>
                        <tr>
                            <th>ID Orden</th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(o => `
                            <tr>
                                <td style="font-weight: 700;">#${o.id_orden}</td>
                                <td>${new Date(o.fecha).toLocaleString()}</td>
                                <td>${o.rut_cliente}</td>
                                <td><button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="verDetalle(${o.id_orden})">Ver Detalle</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            resultsEl.innerHTML = '<p style="text-align:center; color: var(--text-muted); padding: 2rem;">No se encontraron órdenes para este RUT.</p>';
        }
    } catch (error) {
        console.error('Error searching orders:', error);
        resultsEl.innerHTML = '';
        resEl.textContent = 'Error de conexión: ' + error.message;
    }
};

/**
 * [Placeholder] Podría extenderse para ver detalles de la orden (despacho, productos).
 */
window.verDetalle = (id) => {
    alert('Detalle de la orden #' + id + '\nFuncionalidad disponible en versión Pro.');
};

document.getElementById('buscarBtn')?.addEventListener('click', buscarOrdenes);
document.getElementById('rut')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') buscarOrdenes();
});
