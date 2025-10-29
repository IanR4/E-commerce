import express from "express";
import PedidoController from "../controllers/pedidoController.js";

export default function pedidoRoutes() {
    const router = express.Router();

    router.get("/pedidos", (req, res, next) => {
        PedidoController.getPedido(req, res).catch(next);
    });

    router.get("/pedido/:pedidoId", (req, res, next) => {
        PedidoController.getPedido(req, res).catch(next);
    });

    router.post("/pedido", (req, res, next) => {
        PedidoController.postPedido(req, res).catch(next);
    });

    router.patch("/pedido/:pedidoId", (req, res, next) => {
        PedidoController.patchPedido(req, res).catch(next);
    });

    router.get("/usuarios/:usuarioId/pedidos", (req, res, next) => {
        PedidoController.getPedidosUsuario(req, res).catch(next);
    });

    return router;
}
