import express from "express";
import ProductoController from "../controllers/productoController.js";

export default function productoRoutes() {
    const router = express.Router();

    router.get("/producto/:productoId", (req, res, next) => {
        ProductoController.getProducto(req, res).catch(next);
    });

    router.post("/producto", (req, res, next) => {
        ProductoController.postProducto(req, res).catch(next);
    });

    router.get("/vendedores/:vendedorId/productos", (req, res, next) => {
        ProductoController.getProductosVendedor(req, res).catch(next);
    });

    return router;
}