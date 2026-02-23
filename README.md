# Órdenes de Compra – Backend Node.js + PostgreSQL

## Descripción

Aplicación de ejemplo que implementa un servicio HTTP sobre PostgreSQL para manejar órdenes de compra, productos y despacho. El foco está en la consistencia transaccional al generar órdenes y actualizar inventario. Incluye cliente web básico para demostración y utilidades de prueba automatizada.

## Arquitectura

- `index.js` – servidor Express y punto de entrada.
- `db.js` – configuración de conexión a PostgreSQL.
- `models/` – acceso a datos parametrizado.
- `controllers/` – lógica de negocio y control transaccional.
- `routes/` – enrutamiento HTTP.
- `public/` – cliente web estático (HTML/CSS/JS).
- `scripts/init_tables.sql` – creación/semilla de base de datos.
- `tests/` – suites unitarias e integración.

## Requisitos previos

1. Node.js v18+.
2. PostgreSQL con base de datos `ordenes_compra_DB` accesible.
3. Variables de entorno obligatorias:
   - `DB_USER` – usuario de PostgreSQL.
   - `DB_PASSWORD` – contraseña.

> El proyecto no depende de otras variables.

## Preparación

```bash
# clonar repositorio
npm install                   # instalar dependencias
```
Configure las variables de entorno en su shell antes de iniciar el servidor.

## Inicialización de la base de datos

El script `scripts/init_tables.sql` crea las tablas `ordenes_compra` y `stock` (con columnas `nombre`, `precio`, `stock`) y siembra datos de ejemplo. El servidor lo ejecuta automáticamente al arrancar. Para hacerlo manualmente:

```bash
psql -d ordenes_compra_DB -f scripts/init_tables.sql
```

### Resolución de problemas

- Verifique permisos del usuario y que las variables de entorno estén definidas.
- Consulte la salida del servidor para mensajes de inicialización.

## Arranque del servidor

```bash
npm start
```

El servicio quedará disponible en `http://localhost:3000`.

## API REST

| Método | Endpoint                             | Descripción                        |
|--------|--------------------------------------|------------------------------------|
| GET    | `/api?filtro=productos`              | Listado de productos               |
| GET    | `/api?filtro=productos&id={id}`      | Producto por ID                    |
| GET    | `/api?filtro=productos&orden={id}`   | Productos de una orden             |
| GET    | `/api?filtro=ordenes&rut={rut}`      | Órdenes de un cliente              |
| GET    | `/api?filtro=clientes`              | Listado de clientes                |
| GET    | `/api?filtro=clientes&rut={rut}`     | Cliente específico                 |
| GET    | `/api?filtro=direcciones&rut={rut}`  | Direcciones por cliente            |
| GET    | `/api?filtro=despachos&orden={id}`   | Despacho por orden                 |
| POST   | `/orden`                             | Crea orden con transacción         |

Todas las respuestas retornan JSON con `Content-Type: application/json`.

## Interfaz web

Navegue a `/` para acceder al menú principal y a las distintas páginas de consulta/creación.

## Pruebas

```bash
npm test                   # pruebas unitarias
INTEGRATION=true npm test  # incluye integración con BD real
```

Las pruebas de integración ejecutan el script de inicialización y requieren conexión válida.

## Seguridad

- Consultas parametrizadas (sin concatenación SQL).
- Helmet para cabeceras HTTP seguras.
- Validación mínima de entradas.
- Manejo de errores genérico hacia el cliente.

---

Este proyecto es un ejemplo técnico orientado a transacciones y sirve como punto de partida para desarrollos más complejos.
## Endpoints

- `GET /api?filtro=productos` - lista productos
- `GET /api?filtro=productos&id=...` - producto por id
- `GET /api?filtro=productos&orden=...` - productos de una orden
- `GET /api?filtro=ordenes&rut=...` - órdenes por rut de cliente
- `GET /api?filtro=clientes` - lista clientes
- `GET /api?filtro=clientes&rut=...` - cliente por rut
- `GET /api?filtro=direcciones&rut=...` - direcciones por rut
- `GET /api?filtro=despachos&orden=...` - despacho por orden
- `POST /orden` - crea orden transaccionalmente

## Frontend

Abrir `public/index.html` en el navegador o acceder a `/` tras iniciar el servidor.

## Pruebas

```bash
npm test
```

Las pruebas unitarias mockean la conexión a la base para no depender de datos reales.

### Pruebas de integración

Para comprobar que la aplicación se conecta realmente a la base de datos y que las tablas existen se ha añadido
un conjunto de pruebas de integración. Estas pruebas insertan datos provisionales y leen de `stock` y `ordenes_compra`.

Ejecutar con la variable de entorno `INTEGRATION=true`:

```bash
INTEGRATION=true npm test
```

Asegúrate de tener `DB_USER` y `DB_PASSWORD` configurados y de que la base `ordenes_compra_DB` esté accesible. El script
`init_tables.sql` se ejecuta automáticamente al arrancar el servidor y también desde las pruebas.

## Seguridad y notas

- Se usan consultas parametrizadas para prevenir inyección SQL.
- Helmet gestiona cabeceras de seguridad básicas.
- El manejo de errores devuelve mensajes genéricos al cliente.
- El backend sigue modelo MVC simple para claridad.

---

Proyecto diseñado para cumplir con los requisitos de la actividad y listo para extender o desplegar.
# ejercicio_practico_05_mod_7-Transacciones_Node_-_PG-Ordenes_compras
