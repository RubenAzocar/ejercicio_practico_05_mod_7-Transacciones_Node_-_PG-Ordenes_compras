// [BLOQUE: Dependencias]
const pool = require('../db');

/**
 * [BLOQUE: Modelo de Clientes]
 */

const getAll = async () => {
    const { rows } = await pool.query('SELECT rut, nombre, email FROM clientes ORDER BY nombre');
    return rows;
};

const getByRut = async (rut) => {
    const query = {
        text: 'SELECT rut, nombre, email FROM clientes WHERE rut = $1',
        values: [rut]
    };
    const { rows } = await pool.query(query);
    return rows[0] || null;
};


module.exports = { getAll, getByRut };

