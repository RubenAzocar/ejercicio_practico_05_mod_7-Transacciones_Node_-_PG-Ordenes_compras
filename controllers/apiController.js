// [BLOQUE: Importaciones]
const pool = require('../db');
const productoModel = require('../models/producto');
const clienteModel = require('../models/cliente');
const direccionModel = require('../models/direccion');
const ordenModel = require('../models/orden');
const despachoModel = require('../models/despacho');
const { validarRut, formatoRut } = require('../utils/rut');

// [BLOQUE: Helpers de Respuesta]
const sendResponse = (res, status, data, msg) => {
    const success = status >= 200 && status < 300;
    return res.status(status).json({
        ok: success,
        mensaje: msg,
        data: success ? data : undefined,
        error: !success ? msg : undefined
    });
};

const sendError = (res, status, msg) => sendResponse(res, status, null, msg);

// [BLOQUE: Controladores de Consulta (GET)]
const handleGet = async (req, res) => {
    const { filtro, id, orden, rut } = req.query;

    try {
        // Mapa de acciones para evitar switch-case excesivo
        const actions = {
            productos: async () => {
                if (id) return await productoModel.getById(id);
                if (orden) return await productoModel.getByOrden(orden);
                return await productoModel.getAll();
            },
            ordenes: async () => {
                if (!rut) throw { status: 400, message: 'rut es requerido' };
                if (!validarRut(rut)) throw { status: 400, message: 'rut inválido' };
                return await ordenModel.getByRut(formatoRut(rut));
            },
            clientes: async () => {
                if (rut) {
                    if (!validarRut(rut)) throw { status: 400, message: 'rut inválido' };
                    return await clienteModel.getByRut(formatoRut(rut));
                }
                return await clienteModel.getAll();
            },
            direcciones: async () => {
                if (!rut) throw { status: 400, message: 'rut es requerido' };
                if (!validarRut(rut)) throw { status: 400, message: 'rut inválido' };
                return await direccionModel.getByRut(formatoRut(rut));
            },
            despachos: async () => {
                if (!orden) throw { status: 400, message: 'orden es requerida' };
                return await despachoModel.getByOrden(orden);
            }
        };

        if (!actions[filtro]) {
            return sendError(res, 400, 'filtro inválido');
        }

        const result = await actions[filtro]();
        return res.json(result);

    } catch (err) {
        const status = err.status || 500;
        const message = err.message || 'Error al procesar la solicitud';
        console.error(`[GET_ERROR] ${filtro}:`, err);
        return sendError(res, status, message);
    }
};

// [BLOQUE: Controlador de Órdenes (POST)]
/**
 * Crea una nueva orden de compra utilizando transacciones ACID.
 * Garantiza consistencia de stock y registros relacionados.
 */
const handlePostOrder = async (req, res) => {
    const { rut_cliente, direccion, productos } = req.body;

    // Validación de entrada
    if (!rut_cliente || !direccion || !Array.isArray(productos) || productos.length === 0) {
        return sendError(res, 400, 'Datos de orden incompletos o inválidos');
    }

    if (!validarRut(rut_cliente)) {
        return sendError(res, 400, 'RUT de cliente inválido');
    }

    const rutEstandar = formatoRut(rut_cliente);
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Insertar Orden
        const qOrder = {
            text: 'INSERT INTO ordenes_compra (rut_cliente, fecha) VALUES ($1, NOW()) RETURNING id_orden',
            values: [rutEstandar],
        };
        const { rows: orderRows } = await client.query(qOrder);
        const idOrden = orderRows[0].id_orden;

        // 2. Insertar Despacho
        const qDespacho = {
            text: `INSERT INTO despachos (id_orden, calle, ciudad, region, codigo_postal)
                   VALUES ($1, $2, $3, $4, $5)`,
            values: [
                idOrden,
                direccion.calle,
                direccion.ciudad,
                direccion.region,
                direccion.codigo_postal,
            ],
        };
        await client.query(qDespacho);

        // 3. Procesar Productos y Validar Stock
        for (const item of productos) {
            const { id, cantidad } = item;

            if (!id || !cantidad || cantidad <= 0) {
                throw new Error(`Producto o cantidad inválida: ${JSON.stringify(item)}`);
            }

            // Actualización atómica de stock
            const qStock = {
                text: 'UPDATE stock SET stock = stock - $1 WHERE id = $2 RETURNING stock, nombre',
                values: [cantidad, id],
            };
            const { rows: stockRows } = await client.query(qStock);

            if (stockRows.length === 0) {
                throw new Error(`El producto con ID ${id} no existe en inventario`);
            }

            if (stockRows[0].stock < 0) {
                throw new Error(`Stock insuficiente para: ${stockRows[0].nombre} (ID: ${id})`);
            }

            // Registrar en lista de productos
            const qList = {
                text: 'INSERT INTO lista_productos (id_orden, id_producto, cantidad) VALUES ($1, $2, $3)',
                values: [idOrden, id, cantidad],
            };
            await client.query(qList);
        }

        await client.query('COMMIT');
        return sendResponse(res, 201, { id_orden: idOrden }, 'Orden creada exitosamente');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('[TRANSACTION_FAILED] Reverting changes:', error.message);
        return sendError(res, 409, error.message);
    } finally {
        client.release();
    }
};

module.exports = { handleGet, handlePostOrder };

