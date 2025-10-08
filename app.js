import express from "express";
import routes from "./routes/routes.js";
import { swaggerMiddleware } from "./docs/swagger.js";

const app = express();

// Middleware de documentación Swagger
app.use('/api-docs', ...swaggerMiddleware);

app.use(routes);


export default app;