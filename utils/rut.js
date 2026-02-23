// [BLOQUE: Lógica de RUT Chileno]

/**
 * Valida el formato básico de un RUT chileno (longitud y caracteres).
 * @param {string} rut - RUT a validar
 * @returns {boolean}
 */
function validarRut(rut) {
    if (!rut || typeof rut !== 'string') return false;

    // Solo números y K/k
    const limpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();

    // Formato básico: 7-8 dígitos + 1 verificador
    return /^[0-9]{7,8}[0-9K]$/.test(limpio);
}


/**
 * Formatea un RUT a estándar xx.xxx.xxx-x
 * @param {string} rut
 * @returns {string}
 */
function formatoRut(rut) {
    const limpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    if (limpio.length < 2) return rut;

    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);

    let resultado = '';
    let contador = 0;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        resultado = cuerpo[i] + (contador > 0 && contador % 3 === 0 ? '.' : '') + resultado;
        contador++;
    }

    return `${resultado}-${dv}`;
}

module.exports = { validarRut, formatoRut };
