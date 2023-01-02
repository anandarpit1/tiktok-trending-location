import Express from "./Express";
import { Database } from "./Database";
import scrapeJob from "../jobs/scrape.job";

class App {
    // Loads your Server
    public loadServer(): void {
        // Log.info("Server :: Booting @ Master...");
        Express.init();
    }

    // Loads the Database Pool
    public loadDatabase(): void {
        // Log.info("Database :: Booting @ Master...");
        Database.init();
    }
    public loadScheduler(): void {
        scrapeJob.init();
    }
}

export default new App();