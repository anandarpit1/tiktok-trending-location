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
  REDIS_EXPIRY: string;
  REDIS_PORT: number;
  REDIS_HOST: string;
  REDIS_PASSWORD: string;
}

class Locals {
  public static config(): IConfig {
    return {
      PORT: process.env.PORT || 7000,
      NODE_ENV: process.env.NODE_ENV || "",
      MONGODB_URI: process.env.MONGODB_URI || "",
      ENVIRONMENT: process.env.ENVIRONMENT || "DEV",
      SCRAPE_FREQUENCY: process.env.SCRAPE_FREQUENCY || "",
      REDIS_EXPIRY: process.env.REDIS_EXPIRY || "86400",
      REDIS_PORT: Number(process.env.REDIS_PORT || "6379"),
      REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
      REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    };
  }
  public static init(_express: Application): Application {
    _express.locals.app = this.config();
    return _express;
  }
}

export default Locals;
