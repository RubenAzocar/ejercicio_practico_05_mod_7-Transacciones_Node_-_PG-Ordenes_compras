// [BLOQUE: Importaciones]
const express = require('express');
const controller = require('../controllers/apiController');

const router = express.Router();

/**
 * [BLOQUE: Definición de Endpoints]
 */

// Consultas generales (productos, ordenes, clientes, etc)
router.get('/api', controller.handleGet);

// Operaciones transaccionales
router.post('/orden', controller.handlePostOrder);

module.exports = router;

