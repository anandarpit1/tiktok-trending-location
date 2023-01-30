import Locals from "../providers/Locals";
import { Router, Request, Response, NextFunction } from "express";
const router = Router();
import Hash from "../cache/generateHash";
import RedisClient from "../cache/store/redisCacheStore";
import TiktokSchema from "../models/media-tiktok.model";

router.get(
  "/health",
  (request: Request, response: Response, next: NextFunction) => {
    response.status(200).send("OK");
  }
);

router.get(
  "/api/getTrends/:location",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      let location = request.params.location;
      if (!location) {
        location = "US";
      }
      const today = new Date();
      const generateCacheKey =  `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}-${location}`.toString().toLocaleLowerCase();

      const cacheKey = new Hash().generateCacheHash(generateCacheKey);

      const client = new RedisClient();
      let data = JSON.parse(await client.get(cacheKey));
      if (!data) {
        console.log("No data found, Looking in DB");
        data = await TiktokSchema.find({
          location: location,
          date: { $gte: today.getDate() - 60 * 1000 * 24 },
        });
        if(!data && location !== "US") {
          data = await TiktokSchema.find({
            location: "US",
            date: { $gte: today.getDate() - 60 * 1000 * 24 },
          });
        }
        client.set(cacheKey, JSON.stringify(data), parseInt(Locals.config().REDIS_EXPIRY));
      }
      return response.send(data);
    } catch (error) {
      console.log(error);
    }
  }
);

export default router;
