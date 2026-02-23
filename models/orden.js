// [BLOQUE: Dependencias]
const pool = require('../db');

/**
 * [BLOQUE: Modelo de Órdenes]
 */

const getByRut = async (rut) => {
    const query = {
        text: 'SELECT * FROM ordenes_compra WHERE rut_cliente = $1',
        values: [rut]
    };
    const { rows } = await pool.query(query);
    return rows;
};

module.exports = { getByRut };

