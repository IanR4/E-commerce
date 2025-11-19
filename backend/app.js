import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://sol-tienda.netlify.app',
    process.env.FRONTEND_URL 
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        // Permitir requests sin origin (como Postman o curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
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