// [REFACTOR] 20y MODE: funcionalidad+optimización+mantenibilidad
// [BLOQUE: Importaciones]
const express = require('express');
const helmet = require('helmet');
require('dotenv').config();

const pool = require('./db');
const { initDb } = require('./dbInit');
const apiRouter = require('./routes/api');

// [BLOQUE: Configuración de la App]
const app = express();
const PORT = process.env.PORT || 3000;

// [BLOQUE: Middlewares de Seguridad y Core]
app.use(helmet()); // Seguridad básica (headers)
app.use(express.json()); // Parsing de JSON
app.use(express.static('public')); // Archivos estáticos

// [BLOQUE: Registro de Rutas]
app.use('/', apiRouter);

// [BLOQUE: Manejo de Errores Global]
// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({
        ok: false,
        mensaje: `Recurso no encontrado: ${req.originalUrl}`
    });
});

// Error interno del servidor
app.use((err, req, res, next) => {
    console.error(`[SERVER_ERROR] ${err.stack}`);
    res.status(500).json({
        ok: false,
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// [BLOQUE: Inicialización del Servidor]
if (require.main === module) {
    const bootstrap = async () => {
        try {
            await initDb();
            app.listen(PORT, () => {
                console.log(`[SERVER] Ready on http://localhost:${PORT}`);
            });
        } catch (error) {
            console.error('[BOOTSTRAP_ERROR] Failed to start server:', error);
            process.exit(1);
        }
    };
    bootstrap();
}

module.exports = app;

