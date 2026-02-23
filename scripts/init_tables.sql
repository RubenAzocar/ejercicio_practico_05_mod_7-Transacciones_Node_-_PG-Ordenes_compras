-- script to create required tables in ordenes_compra_DB
-- run this script against the database before any query execution
-- assumes you are connected to ordenes_compra_DB
BEGIN;

-- eliminar tablas existentes para asegurar esquema correcto
DROP TABLE IF EXISTS stock;

DROP TABLE IF EXISTS ordenes_compra;

-- tabla de órdenes de compra
CREATE TABLE
    ordenes_compra (
        id_orden serial PRIMARY KEY,
        rut_cliente varchar(20) NOT NULL,
        fecha timestamp NOT NULL DEFAULT NOW()
    );

-- tabla stock con información de productos
CREATE TABLE
    stock (
        id serial PRIMARY KEY,
        nombre varchar(100) NOT NULL,
        precio numeric(10, 2) NOT NULL,
        stock integer NOT NULL DEFAULT 0
    );

COMMIT;

-- provisional seed data (no-op if already present)
BEGIN;

-- add sample products to stock table
INSERT INTO
    stock (nombre, precio, stock)
SELECT
    v.nombre,
    v.precio,
    v.stock
FROM
    (
        VALUES
            ('Producto 1', 10.00, 100),
            ('Producto 2', 20.00, 200),
            ('Producto 3', 30.00, 300),
            ('Producto 4', 40.00, 400),
            ('Producto 5', 50.00, 500),
            ('Producto 6', 60.00, 600),
            ('Producto 7', 70.00, 700),
            ('Producto 8', 80.00, 800),
            ('Producto 9', 90.00, 900),
            ('Producto 10', 100.00, 1000)
    ) as v (nombre, precio, stock)
WHERE
    NOT EXISTS (
        SELECT
            1
        FROM
            stock
        WHERE
            nombre = v.nombre
    );

-- create at least three orders
INSERT INTO
    ordenes_compra (rut_cliente)
SELECT
    '00000000-0'
WHERE
    NOT EXISTS (
        SELECT
            1
        FROM
            ordenes_compra
    );

INSERT INTO
    ordenes_compra (rut_cliente)
SELECT
    '11111111-1'
WHERE
    (
        SELECT
            COUNT(*)
        FROM
            ordenes_compra
    ) < 3;

INSERT INTO
    ordenes_compra (rut_cliente)
SELECT
    '22222222-2'
WHERE
    (
        SELECT
            COUNT(*)
        FROM
            ordenes_compra
    ) < 3;

COMMIT;
