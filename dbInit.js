// [BLOQUE: Dependencias]
const fs = require('fs');
const path = require('path');
const pool = require('./db');

/**
 * [BLOQUE: Inicialización de Base de Datos]
 * Lee el esquema SQL y lo aplica a la base de datos conectada.
 */
const initDb = async () => {
    try {
        // Validación de conexión inicial
        await pool.query('SELECT 1');

        const sqlPath = path.join(__dirname, 'scripts', 'init_tables.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('[DB_INIT] Applying database schema...');
        await pool.query(sql);
        console.log('[DB_INIT] Database schema initialized successfully');

    } catch (err) {
        console.error('[DB_INIT_ERROR] Error initializing database:', err.message);
        throw err; // Re-lanzar para manejar en bootstrap
    }
};

module.exports = { initDb };

