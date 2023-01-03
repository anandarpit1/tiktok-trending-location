import JobCreator from "./jobCreator";
import Locals from "../providers/Locals";
import { location, TIKTOK_TRENDS_URL } from "../config/index";
import proxyIpServices from "../services/proxyIp.services";
import cheerio from "cheerio";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import TiktokSchema from "../models/media-tiktok.model"
class Scraper extends JobCreator {
  constructor() {
    super(Locals.config().SCRAPE_FREQUENCY, Scraper.scrapeTiktok);
  }

  public init = () => {
    Scraper.startJob(); //Replace with the original cron job
  };

  public static startJob = async () => {
    let promises = [];
    for (let i = 0; i < location.length; i++) {
      promises.push(this.scrapeTiktok(i));
    }

    Promise.all(promises)
      .then(() => {
        console.log("All done");
      })
      .catch((e) => {
        console.error(e.message);
      });
  };

  public static scrapeTiktok = async (index: number) => {
    const singleLocationData = [];
    let result = await proxyIpServices.getProxyIp(location[index]);
    const proxy = result.IPs[0].split(":");
    const instance = axios.create({
      httpsAgent: new HttpsProxyAgent({
        host: `${proxy[0]}`,
        port: `${proxy[1]}`,
      }),
    });
    const config = {
      method: "get",
      url: TIKTOK_TRENDS_URL,
    };
    let data = await instance(config);
    const $ = cheerio.load(data.data);

    const body = await $('script[id="SIGI_STATE"]').html();
    try {
      const body1 = JSON.parse(body);
      const objectLength = Object.keys(body1.ItemModule).length;
      for (let i = 0; i < objectLength; i++) {
        const username = Object.keys(body1.UserModule.users)[i];
        const profilePic = {
          large: body1.UserModule.users[username].avatarLarger,
          medium: body1.UserModule.users[username].avatarMedium,
          small: body1.UserModule.users[username].avatarThumb,
        };
        const id = Object.keys(body1.ItemModule)[i];
        const { author, desc } = body1.ItemModule[id];
        const { ratio, cover, originCover, dynamicCover, downloadAddr } =
          body1.ItemModule[id].video;
        const thumbnail = { ratio, cover, originCover, dynamicCover };
        const mediaUrl = downloadAddr;
        const url = `https://www.tiktok.com/@${author}/video/${id}`;
        singleLocationData.push({
          profilePic,
          username,
          desc,
          thumbnail,
          mediaUrl,
          url,
          location: location[index],
        });
      }
    } catch (error) {
      console.log(error.message);
    }
    const coolData = await TiktokSchema.insertMany(singleLocationData);
  };
}

export default new Scraper();
