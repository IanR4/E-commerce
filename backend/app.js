import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());

app.use(cors());

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