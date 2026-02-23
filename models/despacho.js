// [BLOQUE: Dependencias]
const pool = require('../db');

/**
 * [BLOQUE: Modelo de Despachos]
 */

const getByOrden = async (idOrden) => {
    const query = {
        text: 'SELECT * FROM despachos WHERE id_orden = $1',
        values: [idOrden]
    };
    const { rows } = await pool.query(query);
    return rows[0] || null;
};

module.exports = { getByOrden };

