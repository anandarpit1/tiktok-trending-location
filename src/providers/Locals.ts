import { Application } from "express";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

interface IConfig {
    PORT: string | number;
    NODE_ENV: string;
    MONGODB_URI: string;
    ENVIRONMENT: string;
    SCRAPE_FREQUENCY: string;
}

class Locals {
    public static config(): IConfig {
        return {
            PORT: process.env.PORT || 7000,
            NODE_ENV: process.env.NODE_ENV || "",
            MONGODB_URI: process.env.MONGODB_URI || "",
            ENVIRONMENT: process.env.ENVIRONMENT || "DEV",
            SCRAPE_FREQUENCY: process.env.SCRAPE_FREQUENCY || ""
        };
    }
    public static init(_express: Application): Application {
        _express.locals.app = this.config();
        return _express;
    }
}

export default Locals;
