export default class GeneralError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

export class BadRequestError extends GeneralError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}

export class NotFoundError extends GeneralError {
    constructor(message = "Not Found") {
        super(message, 404);
    }
}

export class ValidationError extends GeneralError {
    constructor(message = "Validation Failed", details = []) {
        super(message, 400);
        this.details = details;
    }
}