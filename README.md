[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/ewd7QYGY)

# TP Backend API

API REST para gestión de usuarios, productos, pedidos y notificaciones.

## Requisitos

- Node.js 18+
- MongoDB en ejecución

## Variables de entorno (.env)

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/tp
NODE_ENV=development
```

## Instalación

```
npm install
```

## Ejecutar

```
node server.js
```

La API quedará disponible en: `http://localhost:PORT` (reemplazar PORT por el valor configurado).

## Documentación Swagger

Una vez levantado el servidor acceder a:

`http://localhost:PORT/api-docs`

Allí se visualiza la especificación OpenAPI (`docs/openapi.json`).

## Endpoints Principales

- `GET /health-check` Estado del servicio
- `POST /usuario` Crear usuario
- `GET /usuario/{usuarioId}` Obtener usuario
- `POST /producto` Crear producto
- `GET /producto/{productoId}` Obtener producto
- `GET /vendedores/{vendedorId}/productos` Listar productos de un vendedor con filtros
- `POST /pedido` Crear pedido
- `GET /pedido/{pedidoId}` Obtener pedido
- `PATCH /pedido/{pedidoId}` Actualizar pedido
- `GET /usuarios/{usuarioId}/pedidos` Pedidos de un usuario
- `GET /usuarios/{usuarioId}/notificaciones/leidas` Notificaciones leídas
- `GET /usuarios/{usuarioId}/notificaciones/noleidas` Notificaciones no leídas
- `PATCH /notificacion/{notificacionId}/leer` Marcar notificación como leída

## Estructura del Proyecto

```
controllers/   Lógica de cada recurso
services/      Reglas de negocio
models/        Entidades y esquemas
schemas/       Modelos Mongoose
routes/        Definición de rutas
docs/          Documentación OpenAPI y configuración Swagger
```

## Contribuir

1. Crear rama feature/nombre
2. Realizar cambios y pruebas
3. Abrir Pull Request

## Licencia

Uso académico.

