import { Application } from "express";
import express from "express";
import morgan from "morgan";
import Locals from "../providers/Locals";
class Http {
    public static publicKey: Buffer;

    public static mount(_express: Application): Application {
        console.log("Booting the 'HTTP' middleware...");

        // Disable the x-powered-by header in response
        _express.disable("x-powered-by");

        // Enables the CORS
        // Enables the "gzip" / "deflate" compression for response
        _express.use(express.json());
        _express.use(express.urlencoded({ extended: true }));
        
        if (Locals.config().ENVIRONMENT === "DEV") {
            _express.use(morgan("dev"));
        }
        return _express;
    }
}

export default Http;