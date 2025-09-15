import express from "express";
import PedidoController from "../controllers/pedidoController.js";

const routes = express();

routes.use(express.json());

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

routes.patch("/pedido/:pedidoId", (req, res, next) => {
  PedidoController.patchPedido(req, res, next);
}); 
  
routes.get("/historial/:usuarioId", (req, res, next) => {
  PedidoController.getPedidosUsuario(req, res, next);
});

routes.use((err, req, res, next) => {
  if (err?.name === "ZodError") {
    return res.status(400).json({
      error: "ValidationError",
      details: err.errors
    });
  }
  const upstreamStatus = err?.response?.status;
  res.status(upstreamStatus || 502).json({
    error: err.name || "Error",
    message: err.message
  });
});

export default routes;