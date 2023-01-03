const { HttpsProxyAgent } = require("https-proxy-agent");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
load();

async function load() {
  const instance = axios.create({
    httpsAgent: new HttpsProxyAgent({ host: "149.129.100.105", port: `18716` }),
  });
  const config = {
    method: "get",
    url: "https://www.tiktok.com/foryou",
  };
  let data = await instance(config);
  const $ = cheerio.load(data.data);

  const body = await $('script[id="SIGI_STATE"]').html();
  fs.writeFileSync("test.html", JSON.stringify(data.data), (err) => {
    if (err) {
      console.error(err);
    }
  });
  const body1 = JSON.parse(body);
  const objectLength = Object.keys(body1.ItemModule).length;
  const result = [];
  for(let i =0; i < objectLength; i++) {
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
    const url = `https://www.tiktok.com/@${author}/video/${id}`
    result.push({profilePic, username, desc, thumbnail, mediaUrl, url});
  }
  
  console.log(result);
}

//   console.log(data);
// fs.writeFileSync("test.html", JSON.stringify(data.data), (err) => {
//   if (err) {
//     console.error(err);
//   }
//   // file written successfully
// });
