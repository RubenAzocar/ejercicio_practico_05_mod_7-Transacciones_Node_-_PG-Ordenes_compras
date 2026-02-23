// [BLOQUE: Dependencias]
const pool = require('../db');

/**
 * [BLOQUE: Modelo de Productos/Stock]
 * Encargado de las operaciones de lectura en la tabla stock.
 */

const getAll = async () => {
    const { rows } = await pool.query('SELECT id, nombre, stock FROM stock ORDER BY nombre ASC');
    return rows;
};

const getById = async (id) => {
    const query = {
        text: 'SELECT id, nombre, stock FROM stock WHERE id = $1',
        values: [id]
    };
    const { rows } = await pool.query(query);
    return rows[0] || null;
};

const getByOrden = async (idOrden) => {
    const query = {
        text: `SELECT p.id, p.nombre, lp.cantidad
               FROM lista_productos lp
               JOIN stock p ON lp.id_producto = p.id
               WHERE lp.id_orden = $1`,
        values: [idOrden],
    };
    const { rows } = await pool.query(query);
    return rows;
};

module.exports = { getAll, getById, getByOrden };

