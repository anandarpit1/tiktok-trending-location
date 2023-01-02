import express, { Request, Response, NextFunction } from "express";
import path from "path";
import Locals from "./Locals";
import apiRouter from "../routes/index";
import Http from "../middlewares/http.middleware";
import ExceptionHandler from "../exceptions/Handler";


class Express {
    /**
     * Create the express object
     */
    public express: express.Application;

    /**
     * Initializes the express server
     */
    constructor() {
        this.express = express();
        this.mountMiddlewares();
        this.mountRoutes();
    }
    /**
     * Mounts all the defined routes
     */
    private mountMiddlewares(): void {
        Http.mount(this.express);
    }
    /**
     * Mount all the services
     */
    public static mountServices(): void {}
    /**
     * Mounts all the defined routes
     */
    private mountRoutes(): void {
        // const apiPrefix = Locals.config().API_PREFIX;
        // this.express.use(`/${apiPrefix}`, apiRouter);
        this.express.use(apiRouter)
        this.express.use((request: Request, response: Response) => {
            response.status(404).json({
                status: "NotFound",
                message: "Resource not available",
            });
        });
    }

    public getExpress(): express.Application {
        return this.express;
    }

    /**
     * Starts the express server
     */
    public init(): any {
        const port = Locals.config().PORT;
        this.express.use(ExceptionHandler.errorHandler);
        // Start the server on the specified port
        this.express.listen(port, () => {
            return console.log(
                "\x1b[33m%s\x1b[0m",
                `Server :: Running @ 'http://localhost:${port}'`
            );
        });
    }
}

/** Export the express module */
export default new Express();