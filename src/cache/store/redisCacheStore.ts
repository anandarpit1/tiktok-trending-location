import IoRedis, { Redis } from "ioredis";
import Locals from "../../providers/Locals";
class RedisStore {
  private client;
  constructor() {
    this.client = new IoRedis({
      host: Locals.config().REDIS_HOST,
      port: Locals.config().REDIS_PORT,
      password: Locals.config().REDIS_PASSWORD,
    });
    this.client.monitor((error) => {
      if (error) {
        console.log("[Error in Redis connection]", error);
      } else {
        console.log("[Redis connected]");
      }
    });
  }

  public async get(key) {
    return this.client.get(key);
  }

  public async set(key, value, expiry = null) {
    if (expiry) {
      return this.client.set(key, value, "EX", expiry);
    }
    return this.client.set(key, value);
  }
}

export default RedisStore;
