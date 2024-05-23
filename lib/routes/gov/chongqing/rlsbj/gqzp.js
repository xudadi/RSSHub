const rssParser = require('rss-parser');
const fetch = require('node-fetch');

module.exports = {
  name: '重庆国企招聘信息',
  description: '重庆市国有资产监督管理委员会国企招聘栏目的招聘信息',
  async fetch() {
    const url = 'https://gzw.cq.gov.cn/gqzp/';
    const res = await fetch(url);
    const html = await res.text();
    // 使用 cheerio 来解析 HTML，需要安装 cheerio：npm install cheerio
    const $ = cheerio.load(html);
    const items = [];
    
    // 假设招聘信息列表在 ul 类名为 'tab-item' 的元素中
    $('ul.tab-item > li').each((index, element) => {
      const title = $(element).find('a').text().trim();
      const link = $(element).find('a').attr('href');
      const date = $(element).find('span').text().trim();
      
      // 将相对链接转换为绝对链接
      const absoluteLink = new URL(link, url).href;
      
      items.push({
        title: title,
        description: title, // RSS 中通常使用描述，这里简化为标题相同
        link: absoluteLink,
        pubDate: new Date(date).toUTCString() // RSS 要求 pubDate 为 UTC 时间格式
      });
    });
    
    return items;
  },
  async parse rss() {
    const feed = new rssParser_FEED(this.name, this.description, '链接到你的 RSSHub 路由');
    const items = await this.fetch();
    
    items.forEach(item => {
      feed.addItem({
        title: item.title,
        description: item.description,
        link: item.link,
        date: item.pubDate
      });
    });
    
    return feed;
  }
};
