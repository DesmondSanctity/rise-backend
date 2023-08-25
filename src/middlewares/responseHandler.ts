import { Request, Response, NextFunction } from "express";

// error-handler.ts

export class AppError extends Error {

    status: string;
    statusCode: number;

    constructor(status: string, message: string, statusCode = 500) {

        super(message);

        this.name = this.constructor.name;
        this.status = status;
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);

    }

}


export class AppSuccess {

    status: string;
    data: any;
    message: string;
    statusCode: number;

    constructor(status: string, message: string, data: any, statusCode: number) {
        this.status = status;
        this.data = data;
        this.message = message;
        this.statusCode = statusCode || 200;
    }

    send(res: Response) {
        res.status(this.statusCode).json({
            status: this.status,
            message: this.message,
            data: this.data,
        });
    }

}