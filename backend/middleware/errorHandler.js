import GeneralError from "../errors/errors.js";

export function errorHandler(err, _req, res, _next) {
    // Manejar errores de Cast de Mongoose
    if (err.name === 'CastError') {
        return res.status(400).json({ 
            error: "BadRequestError",
            message: `Invalid ${err.path} format` 
        });
    }

    // Manejar errores de validación de Mongoose
    if (err.name === 'ValidationError') {
        return res.status(400).json({ 
            error: "ValidationError",
            message: err.message 
        });
    }

    if (err instanceof GeneralError) {
        const response = { error: err.name || "Error" };
        response.message = err.message;
        if (err.details) response.details = err.details;
        return res.status(err.statusCode || 502).json(response);
    }

    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal Server Error" });
}
