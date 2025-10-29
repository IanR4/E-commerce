import express from "express";
import routes from "./routes/routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());

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