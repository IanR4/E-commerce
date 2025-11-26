import dotenv from "dotenv";
dotenv.config({ path: ".env" }); 

import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());

const allowedOrigins = [
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
    process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : null,
    process.env.FRONTEND_URL
].filter(Boolean);

console.log("ALLOWED ORIGINS:", allowedOrigins);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
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
    if (maybePromise && typeof maybePromise.then === 'function') {
        maybePromise.then((router) => {
            if (router && (typeof router === 'function' || router.stack)) app.use(router);
        }).catch((err) => {
            console.error('Error initializing route:', err);
        });
    } else if (maybePromise && (typeof maybePromise === 'function' || maybePromise.stack)) {
        app.use(maybePromise);
    } else {
        console.warn('Skipped loading a route because it did not return a router or promise.');
    }
});

app.use(errorHandler);

export default app;
