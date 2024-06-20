const got = require('got');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const url = 'https://www.gongkaoleida.com/area/2460-2461-0-2,3,59,78-124';
  
  try {
    const response = await got(url);
    const $ = cheerio.load(response.body);
    
    // 假设网页中列表项的类名为 'list-item'，并且每个列表项包含一个链接和一个标题
    const items = [];
    $('.list-item').each((index, element) => {
      const title = $(element).find('.title').text().trim(); // 假设标题在 '.title' 元素中
      const link = $(element).find('a').attr('href'); // 假设链接在 'a' 标签的 'href' 属性中
      items.push({ title, link });
    });
    
    // RSS 头部信息
    const feed = {
      title: '重庆公考雷达',
      description: '重庆公考雷达 RSS 订阅',
      feedUrl: url,
      siteUrl: 'https://www.gongkaoleida.com',
      image: 'https://www.gongkaoleida.com/favicon.ico', // 假设网站有 favicon.ico
      author: '步知公考',
      items: items
    };
    
    // 将 RSS 信息转换为 XML 格式
    res.set('Content-Type', 'text/xml');
    res.send(rss(feed));
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 此处应包含 rss 函数的实现，用于将 feed 对象转换为 XML 格式的 RSS 源
// 这个函数通常使用 rss 库来实现，例如：
// const rss = require('rss');
// const feed = new rss(feedOptions);
// feed.item(itemOptions);
// return feed.xml();
