import express from "express";
import PedidoController from "../controllers/pedidoController.js";
import UsuarioController from "../controllers/usuarioController.js";
import ProductoController from "../controllers/productoController.js";
import GeneralError from "../errors/errors.js";
import NotificacionController from "../controllers/notificacionController.js";

const routes = express();

routes.use(express.json());

routes.get("/health-check", (req, res) => {
  res.status(200).json({ message: "API is healthy" });
});

routes.get("/pedidos", (req, res, next) => {
  PedidoController.getPedido(req, res, next);
});

routes.get("/pedido/:pedidoId", (req, res, next) => {
  PedidoController.getPedido(req, res, next);
});

routes.post("/pedido", (req, res, next) => {
  PedidoController.postPedido(req, res, next);
});

routes.get("/usuario/:usuarioId", (req, res, next) => {
  UsuarioController.getUsuario(req, res, next);
});

routes.post("/usuario", (req, res, next) => {
  UsuarioController.postUsuario(req, res, next);
});

routes.get("/producto/:productoId", (req, res, next) => {
  ProductoController.getProducto(req, res, next);
});

routes.post("/producto", (req, res, next) => {
  ProductoController.postProducto(req, res, next);
});

routes.patch("/pedido/:pedidoId", (req, res, next) => {
  PedidoController.patchPedido(req, res, next);
}); 
  
routes.get("/usuarios/:usuarioId/pedidos", (req, res, next) => {
  PedidoController.getPedidosUsuario(req, res, next);
});


routes.get("/usuarios/:usuarioId/notificaciones/leidas", (req, res, next) => {
  NotificacionController.getNotificacionesLeidasUsuario(req, res, next);
});

routes.get("/usuarios/:usuarioId/notificaciones/noleidas", (req, res, next) => {
  NotificacionController.getNotificacionesNoLeidasUsuario(req, res, next);
});

routes.patch("/usuarios/:usuarioId/notificaciones/:notificacionId/leida", (req, res, next) => {
  NotificacionController.marcarNotificacionComoLeida(req, res, next);
});

routes.use((err, _req, res, _next) => {
  if (err instanceof GeneralError) {
    const response = { error: err.name || "Error" };
    response.message = err.message;
    if (err.details) response.details = err.details;
    return res.status(err.statusCode || 502).json(response);
  }

  console.error("Unhandled error: ", err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default routes;