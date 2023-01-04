const Redis = require("ioredis");

class RedisStore {
  private client;
  constructor() {
    this.client = new Redis("127.0.0.1:6379");
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
