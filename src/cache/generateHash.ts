const crypto = require("crypto");

class Hash {
  public generateCacheHash(input: string) {
    return crypto.createHash("sha256").update(input).digest("hex");
  }
}
export default Hash;
