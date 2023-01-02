import JobCreator from "./jobCreator";
import Locals from "../providers/Locals";
import { location } from "../config/index"
import proxyIpServices from "../services/proxyIp.services";

class Scraper extends JobCreator {
    constructor() {
        super(Locals.config().SCRAPE_FREQUENCY, Scraper.scrapeTrends);
    }

    public init = () => {
        this.job.start();
    };

    public static scrapeTrends = async () => {
        for(let i = 0; i < location.length; i++) {
            let result = await proxyIpServices.getProxyIp(location[i]);
            console.log(result);
        }
    }
}

export default new Scraper();