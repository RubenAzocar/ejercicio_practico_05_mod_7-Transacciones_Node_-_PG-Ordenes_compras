// [BLOQUE: Lógica Interfaz Orden]

const state = {
    lineCount: 0
};

/**
 * Agrega una nueva fila de producto al formulario.
 */
const agregarLinea = () => {
    state.lineCount++;
    const div = document.createElement('div');
    div.className = 'form-grid';
    div.style = 'display: grid; grid-template-columns: 2fr 1fr auto; gap: 0.5rem; align-items: center; background: #f8fafc; padding: 0.75rem; border-radius: 8px;';

    div.innerHTML = `
        <input type="number" class="pid" placeholder="ID Producto">
        <input type="number" class="cant" placeholder="Cantidad">
        <button class="btn btn-outline" style="color: var(--danger); border-color: var(--danger); padding: 0.5rem;" onclick="this.parentElement.remove()">✕</button>
    `;
    document.getElementById('productos').appendChild(div);
};

/**
 * Envía la orden al servidor encapsulada en una transacción.
 */
const enviarOrden = async () => {
    const resEl = document.getElementById('res');
    const btnEnvia = document.getElementById('enviarBtn');

    const payload = {
        rut_cliente: document.getElementById('rut').value.trim(),
        direccion: {
            calle: document.getElementById('calle').value.trim(),
            ciudad: document.getElementById('ciudad').value.trim(),
            region: document.getElementById('region').value.trim(),
            codigo_postal: document.getElementById('cp').value.trim(),
        },
        productos: Array.from(document.querySelectorAll('#productos > div')).map(div => ({
            id: parseInt(div.querySelector('.pid').value),
            cantidad: parseInt(div.querySelector('.cant').value)
        }))
    };

    try {
        btnEnvia.disabled = true;
        btnEnvia.textContent = 'Procesando...';
        resEl.textContent = 'Enviando transacción...';

        const response = await fetch('/orden', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            resEl.style.color = 'var(--success)';
            resEl.textContent = `✅ Éxito: Orden #${data.data.id_orden} creada correctamente.`;
        } else {
            resEl.style.color = 'var(--danger)';
            resEl.textContent = `❌ Error: ${data.mensaje || 'Error desconocido'}`;
        }
    } catch (error) {
        console.error('Error post order:', error);
        resEl.textContent = `⚠️ Error de comunicación: ${error.message}`;
    } finally {
        btnEnvia.disabled = false;
        btnEnvia.textContent = '🚀 Procesar Orden (Transacción ACID)';
    }
};

// [BLOQUE: Event Listeners]
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('agregarBtn')?.addEventListener('click', agregarLinea);
    document.getElementById('enviarBtn')?.addEventListener('click', enviarOrden);

    // Iniciar con una línea vacía
    agregarLinea();
});
