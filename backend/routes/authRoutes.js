import express from "express";
import AuthController from "../controllers/authController.js";

export default function authRoutes() {
    const router = express.Router();

    router.post("/register", (req, res) => {
        AuthController.postRegister(req, res);
    });

    router.post("/login", (req, res) => {
        AuthController.postLogin(req, res);
    });

    return router;
}