import { NextFunction, Request, Response } from "express";
import APIError from "./APIError";
import ValidationError from "./ValidationError";

class Handler {
    /**
     * Show undermaintenance page incase of errors
     */
    public static errorHandler(
        err: Error | ValidationError | APIError,
        req: Request,
        res: Response,
        next: NextFunction
    ): any {
        console.log(err);
        if (err instanceof ValidationError || err instanceof APIError) {
            return res
                .status(err.status)
                .json({ status: err.name, error: err.message });
        }
        return res.status(500).json({
            status: "error",
            error: err.message,
        });
        next();
    }
}

export default Handler;
