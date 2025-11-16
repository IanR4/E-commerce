import express from "express";
import AuthController from "../controllers/authController.js";

export default function authRoutes() {
    const router = express.Router();

    router.post("/register", (req, res, next) => {
        AuthController.postRegister(req, res).catch(next);
    });

    router.post("/login", (req, res, next) => {
        AuthController.postLogin(req, res).catch(next);
    });

    return router;
}