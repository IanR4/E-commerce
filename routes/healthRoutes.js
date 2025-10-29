import express from "express";

export default function healthRoutes() {
    const router = express.Router();

    router.get("/health-check", (req, res) => {
        res.status(200).json({ message: "API is healthy" });
    });

    return router;
}