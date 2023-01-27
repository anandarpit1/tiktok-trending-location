const Redis = require("ioredis");
import Locals from "../../providers/Locals";
class RedisStore {
  private client;
  constructor() {
    const connString = Locals.config().REDIS_HOST + ":" + parseInt(Locals.config().REDIS_PORT);
    this.client = new Redis();
    this.client.on("error", (err) => console.log("Redis Client Error", err));
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
