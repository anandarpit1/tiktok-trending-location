import JobCreator from "./jobCreator";
import Locals from "../providers/Locals";
import { location } from "../config/index";
import proxyIpServices from "../services/proxyIp.services";
import puppeteerService from "../services/puppeteer.service";
import useProxy from "puppeteer-page-proxy";
import cheerio from "cheerio";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
class Scraper extends JobCreator {
  constructor() {
    super(Locals.config().SCRAPE_FREQUENCY, Scraper.scrapeTiktok);
  }

  public init = () => {
    Scraper.scrapeTiktok();
  };

  public static scrapeTrends = async () => {
    const browser = puppeteerService.getBrowserobject();
    for (let i = 0; i < location.length; i++) {
      let result = await proxyIpServices.getProxyIp(location[i]);
      const proxy = result.IPs[0].split(":");
      console.log(proxy);

      let videoCount = Locals.config().EACH_LOCATION_VIDEO_COUNT;
      let url = Locals.config().TIKTOK_TRENDS_URL;
      console.log(videoCount);

      for (let j = 0; j < videoCount; j++) {
        const page = await browser.newPage();
        await useProxy(page, `http://${proxy[0]}:${proxy[1]}`);

        const data = await useProxy.lookup(page);
        console.log(data.ip);

        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 0,
        });
        await page.screenshot({ path: `tiktok-page.png` });

        const scrapedUrl = await page.evaluate(async () => {
          let video = document.querySelector("video");
          return video;
        });
        console.log(scrapedUrl);

        await page.close();
      }
    }
  };

  public static scrapeTiktok = async () => {
    let completeVideoData = [];
    for (let i = 0; i < location.length; i++) {
      let videoCount = Locals.config().EACH_LOCATION_VIDEO_COUNT;

      const locationVideoData = new Set();

      for (let j = 0; j < videoCount; j++) {
        let result = await proxyIpServices.getProxyIp(location[i]);
        const proxy = result.IPs[0].split(":");
        const instance = axios.create({
          httpsAgent: new HttpsProxyAgent({
            host: `${proxy[0]}`,
            port: `${proxy[1]}`,
          }),
        });
        const config = {
          method: "get",
          url: "https://www.tiktok.com/foryou",
        };
        let data = await instance(config);
        const $ = cheerio.load(data.data);

        const body = await $('script[id="SIGI_STATE"]').html();
        try {
          const body1 = JSON.parse(body);
        const username = Object.keys(body1.UserModule.users)[0];
        const profilePic = {
          large: body1.UserModule.users[username].avatarLarger,
          medium: body1.UserModule.users[username].avatarMedium,
          small: body1.UserModule.users[username].avatarThumb,
        };
        const id = Object.keys(body1.ItemModule)[0];
        const description = body1.ItemModule[id].desc;
        const { ratio, cover, originCover, dynamicCover, downloadAddr } =
          body1.ItemModule[id].video;
        const thumbnail = { ratio, cover, originCover, dynamicCover };
        const mediaUrl = downloadAddr;

        const vData = [
          { profilePic },
          { username },
          { description },
          { thumbnail },
          { mediaUrl },
        ];
        locationVideoData.add(vData);
        } catch (error) {
          console.log(error.message);
          videoCount;
        }
      }
      console.log(locationVideoData);
      completeVideoData.push({ iso: location[i], data: locationVideoData });
    }
    console.log(completeVideoData);
  };
}

export default new Scraper();
