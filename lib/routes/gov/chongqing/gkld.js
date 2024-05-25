const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.gongkaoleida.com/area/2460-2461-0-2,3,59,78-124');
    
    // 使用 evaluate 方法来执行 XPath 查询并获取所需的元素内容
    const list = await page.evaluate(() => {
      const nodeList = document.evaluate('/html/body/section/div[4]/div/div/div[1]/ul', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const items = [];
      for (let i = 0; i < nodeList.snapshotLength; i++) {
        items.push(nodeList.snapshotItem(i).outerHTML);
      }
      return items;
    });

    await browser.close();

    // 将获取到的内容作为 HTML 返回给客户端
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(list.join('\n'));
  } catch (error) {
    console.error('Error fetching data:', error);
    if (res && res.status) {
      res.status(500).send('An error occurred while fetching data.');
    } else {
      console.error('Response object is undefined or missing status method.');
    }
  }
};
