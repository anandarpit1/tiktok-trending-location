import {env_variables as config} from "../config/index";
import axios from "axios";
import crypto from "crypto";
import { resolve4 } from "dns/promises";

class proxyIp {
  private license;
  private secret;
  private ts;
  private iso;
  private cnt;
  private queries;
  public constructor() {
    this.license = config.proxyLicenseKey;
    this.secret = config.proxySecretKey;
    this.cnt = config.proxyCount;
    this.ts = Math.floor(+Date.now() / 1000);
  }

  public async getProxyIp(iso: string) {
    try {
      const md5Sum = crypto.createHash("md5");
      md5Sum.update(this.license + this.ts + this.secret);
      this.queries = {
        license: this.license,
        time: this.ts,
        cnt: this.cnt,
        iso: iso,
      };
      this.queries.sign = md5Sum.digest("hex").toLowerCase();
      const proxyData = await axios.get("https://api.ttproxy.com/v1/obtain", {
        params: this.queries,
      });
      const res = {
        IPs: proxyData.data.data.proxies,
        IPstatus: proxyData.status,
      };
      return res;
    } catch (err) {
      console.log("This is error: " + err);
    }
  }
}

export default new proxyIp();
