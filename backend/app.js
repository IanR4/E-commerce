import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());

const allowedOrigins = [
    process.env.FRONTEND_URL,
    // Include common local dev origins when NOT running in production.
    ...(process.env.NODE_ENV === 'development' ? [] : ['http://localhost:3000', 'http://localhost:3001'])
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        // Log the origin we received to help debugging CORS rejections
        // Permitir requests sin origin (como Postman o curl)
        // No Origin header (curl/postman) -> allow
        if (!origin) return callback(null, true);

        // Browsers loading pages via file:// often send Origin as the string 'null'
        // or a file:// URL. Allow those in development or when explicitly enabled.
        if (origin === 'null' || origin.startsWith('file://')) {
            if (process.env.NODE_ENV === 'production' && process.env.ALLOW_FILE_ORIGINS !== 'true') {
                return callback(new Error('Not allowed by CORS'));
            }
            return callback(null, true);
        }

        // Allow all origins in development if explicitly requested (convenience)
        if (process.env.NODE_ENV === 'development' && process.env.ALLOW_ALL_CORS === 'true') {
            return callback(null, true);
        }

        if (allowedOrigins.indexOf(origin) !== -1) {
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
    // Support route functions that return either:
    // - an Express Router (synchronous)
    // - a Promise that resolves to a Router (asynchronous)
    // Use duck-typing for promises to be compatible with different runtimes.
    if (maybePromise && typeof maybePromise.then === 'function') {
        maybePromise.then((router) => {
            if (router && (typeof router === 'function' || router.stack)) app.use(router);
        }).catch((err) => {
            // ignore route load errors during app initialization but log for debugging
            console.error('Error initializing route:', err);
        });
    } else if (maybePromise && (typeof maybePromise === 'function' || maybePromise.stack)) {
        app.use(maybePromise);
    } else {
        // If routeFn returned something unexpected, skip it to avoid crashing the app
        console.warn('Skipped loading a route because it did not return a router or promise.');
    }
});

app.use(errorHandler);

export default app;