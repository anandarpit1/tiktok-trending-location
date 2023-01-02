import puppeteer from 'puppeteer'

class Puppeteer {
  public browser;
  pageCount = 0;
  public async initiate() {
    return await this.launchBrowser();
  }

  private async launchBrowser() {
    console.log("starting browser")
    this.browser = await puppeteer.launch({
      headless: true,
    //   devtools: false,
    //   executablePath: '/snap/bin/chromium',
      args: [
        '--start-maximized',
        '--disable-dev-shm-usage',
        // '--disable-setuid-sandbox',
        '--no-sandbox',
        '--disable-site-isolation-trials',
      ],
    });
    console.log("browser launched")
  }

  public getBrowserobject() {
    return this.browser;
  }
}

export default new Puppeteer();