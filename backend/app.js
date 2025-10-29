import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";

const app = express();

// Habilitar CORS para el cliente (React dev server en puerto 3000)
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));

app.use(routes);

export default app;