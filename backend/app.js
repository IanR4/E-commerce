import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL?.split(',') || [] // Permitir múltiples URLs si es necesario
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'], // URLs comunes de desarrollo
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

routes.forEach((routeFn) => {
    const maybePromise = routeFn();
    if (maybePromise instanceof Promise) {
        maybePromise.then((router) => app.use(router));
    } else {
        app.use(maybePromise);
    }
});

app.use(errorHandler);

export default app;