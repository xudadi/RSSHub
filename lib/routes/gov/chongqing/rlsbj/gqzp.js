// 引入 cheerio 用于解析 HTML
const cheerio = require('cheerio');

module.exports = {
  name: '重庆国企招聘信息',
  route: 'https://gzw.cq.gov.cn/gqzp/:page?', // 路由规则，:page? 表示页码是可选的
  async parse({ html, url }) {
    // 使用 cheerio 加载 HTML
    const $ = cheerio.load(html);
    const items = [];

    // 遍历每个招聘信息列表项
    $('ul.tab-item > li').each((index, element) => {
      const title = $(element).find('a').text().trim(); // 招聘信息标题
      const link = $(element).find('a').attr('href'); // 招聘信息链接
      const date = $(element).find('span').text().trim(); // 日期

      // 构造每个 item 的详细信息
      items.push({
        title: title,
        description: title, // 描述与标题相同，您可以根据需要修改
        link: new URL(link, url).href, // 确保链接是绝对路径
        pubDate: new Date(date).toUTCString() // 根据日期生成符合 RSS 规范的时间格式
      });
    });

    return items;
  },
  test: async () => {
    // 测试路由是否有效
    const url = 'https://gzw.cq.gov.cn/gqzp/';
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    });
    return response.ok;
  }
};
