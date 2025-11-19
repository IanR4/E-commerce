import express from "express";
import swaggerUiExpress from "swagger-ui-express";
import { readFile } from "node:fs/promises";
import path from "path";

export default function swaggerRoutes() {
    const router = express.Router();

    // Use an explicit path based on the current working directory so tests
    // running under Jest (which may not support import.meta) don't fail.
    const docsPath = path.join(process.cwd(), "docs", "otra-docs.json");

    return readFile(docsPath)
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