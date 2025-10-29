import express from "express";
import swaggerUiExpress from "swagger-ui-express";
import { readFile } from "node:fs/promises";

export default function swaggerRoutes() {
    const router = express.Router();

    return readFile(new URL("../docs/otra-docs.json", import.meta.url))
        .then((data) => {
            const swaggerDocument = JSON.parse(data);

            router.use("/otra-docs", swaggerUiExpress.serve);
            router.get("/otra-docs", swaggerUiExpress.setup(swaggerDocument));

            return router;
        })
        .catch((err) => {
            console.error("Error loading Swagger file:", err);
            return router; // devolvemos el router vacío para que no rompa
        });
}