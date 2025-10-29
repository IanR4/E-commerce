import express from "express";
import UsuarioController from "../controllers/usuarioController.js";

export default function usuarioRoutes() {
    const router = express.Router();

    router.get("/usuario/:usuarioId", UsuarioController.getUsuario);

    router.post("/usuario", UsuarioController.postUsuario);

    return router;
}

