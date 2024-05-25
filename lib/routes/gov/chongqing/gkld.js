const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.gongkaoleida.com/area/2460-2461-0-2,3,59,78-124');
    const content = await page.content();
    await browser.close();

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('An error occurred while fetching data.');
  }
};
