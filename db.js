// [BLOQUE: Dependencias]
const { Pool } = require('pg');
require('dotenv').config();

// [BLOQUE: Configuración de Conexión]
/**
 * Configuración optimizada para PostgreSQL Pool.
 * Se utilizan variables de entorno para credenciales sensibles.
 */
const poolConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    port: 5432,
    database: 'ordenes_compra_DB',
    max: 20, // Máximo de clientes en el pool
    idleTimeoutMillis: 30000, // Tiempo antes de cerrar cliente inactivo
    connectionTimeoutMillis: 2000, // Tiempo de espera para conectar
};

if (!poolConfig.user || !poolConfig.password) {
    console.error('[DATABASE_ERROR] DB_USER and DB_PASSWORD are required in .env');
    process.exit(1);
}

const pool = new Pool(poolConfig);

// [BLOQUE: Manejo de Eventos del Pool]
pool.on('error', (err) => {
    console.error('[DATABASE_CRITICAL] Unexpected error on idle client', err);
});

module.exports = pool;

