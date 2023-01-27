import JobCreator from "./jobCreator";
import Locals from "../providers/Locals";
import { location, TIKTOK_TRENDS_URL } from "../config/index";
import proxyIpServices from "../services/proxyIp.services";
import cheerio from "cheerio";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import TiktokSchema from "../models/media-tiktok.model";
import Hash from "../cache/generateHash";
import RedisClient from "../cache/store/redisCacheStore";
import path from "path";
import fs from "fs";

class Scraper extends JobCreator {
  constructor() {
    super(Locals.config().SCRAPE_FREQUENCY, Scraper.startJob);
  }

  public init = () => {
    this.job.start();
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
    let proxyResult = await proxyIpServices.getProxyIp(location[index]);
    // fs.writeFileSync(path.join(__dirname, '../../test/proxyData.json'), JSON.stringify(proxyResult));
    const proxy = proxyResult.IPs[0].split(":");
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
      fs.writeFileSync(
        path.join(__dirname, "../../test/trends-tiktok.json"),
        JSON.stringify(body1)
      );
      const objectLength = Object.keys(body1.ItemModule).length;
      for (let i = 0; i < objectLength; i++) {
        const id = Object.keys(body1.ItemModule)[i];
        const { author } = body1.ItemModule[id];
        const { ratio, cover, originCover, dynamicCover } =
          body1.ItemModule[id].video;
        const thumbnail = { ratio, cover, originCover, dynamicCover };
        const url = `https://www.tiktok.com/@${author}/video/${id}`;

        //Musical.ly api for no_watermark implementation
        const currentProxy =
          proxyResult.IPs[(i + 1) % proxyResult.IPs.length].split(":");
        const insta = axios.create({
          httpsAgent: new HttpsProxyAgent({
            host: `${currentProxy[0]}`,
            port: `${currentProxy[1]}`,
          }),
        });
        const conf = {
          method: "get",
          url: "https://api2.musical.ly/aweme/v1/feed/" + `?aweme_id=${id}`,
        };
        let data = await insta(conf);
        if (data) {
          const x = data.data;
          fs.writeFileSync(
            path.join(__dirname, "../../test/musically-tiktok.json"),
            JSON.stringify(x)
          );
          const audioUrl = {
            title: x.aweme_list[0].music.title,
            author: x.aweme_list[0].music.author,
            audio: x.aweme_list[0].music.play_url.uri,
          };
          const username = x.aweme_list[0].author.unique_id;
          const profilePic = {
            hd: x.aweme_list[0].music.cover_hd.url_list[0],
            large: x.aweme_list[0].music.cover_large.url_list[0],
            medium: x.aweme_list[0].music.cover_medium.url_list[0],
            thumbnail: x.aweme_list[0].music.cover_thumb.url_list[0],
          };
          const description = x.aweme_list[0].desc;
          const video_nw = [
            x.aweme_list[0].video.play_addr.url_list[0],
            x.aweme_list[0].video.play_addr.url_list[1],
            x.aweme_list[0].video.play_addr.url_list[2],
          ];
          const video_w = [
            x.aweme_list[0].video.download_addr.url_list[0],
            x.aweme_list[0].video.download_addr.url_list[1],
            x.aweme_list[0].video.download_addr.url_list[2],
          ];
          const dimensions = {
            width: x.aweme_list[0].video.download_addr.width,
            height: x.aweme_list[0].video.download_addr.height,
            size: x.aweme_list[0].video.download_addr.data_size,
          };
          const play_count = x.aweme_list[0].statistics.play_count;

          singleLocationData.push({
            profilePic,
            url,
            thumbnail,
            username,
            audioUrl,
            description,
            video_nw,
            video_w,
            dimensions,
            play_count,
            location: location[index],
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
    await TiktokSchema.insertMany(singleLocationData);
    // const today = new Date();
    // const generateCacheKey = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}-${
    //   location[index]
    // }`;
    // const cacheKey = new Hash().generateCacheHash(generateCacheKey);

    // const client = new RedisClient();
    // client.set(
    //   cacheKey,
    //   JSON.stringify(singleLocationData),
    //   Locals.config().REDIS_EXPIRY
    // );
  };
}

export default new Scraper();
