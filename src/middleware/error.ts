import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

class HttpException extends Error {
    status: number;
    message: string;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
}

const errorHandler = (
    err: HttpException,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    res.status(status).send({
        status,
        message,
    });
};

// middleware.js
const errorLogger = (
    err: HttpException,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.error('\x1b[31m', err); // adding some color to our logs
    next(err); // calling next middleware
};

const invalidPathHandler = (req: Request, res: Response) => {
    res.redirect('/error');
};

export default {errorHandler , errorLogger}