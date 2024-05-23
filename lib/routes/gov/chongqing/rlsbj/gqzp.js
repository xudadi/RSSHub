module.exports = {
  name: '重庆市国有资产监督管理委员会国企招聘',
  route: '/cqgzw/gqzp',
  async parse({ url, req }) {
    // 模拟请求网页内容，RSSHub 运行环境会处理实际的 HTTP 请求
    const html = await req(url);

    // 加载 cheerio，并用 HTML 内容
    const $ = require('cheerio').load(html);

    // 寻找所有招聘信息列表项
    const items = [];
    $('ul.tab-item > li').each((index, element) => {
      // 提取招聘信息的标题、链接和日期
      const title = $(element).find('a').text();
      const link = $(element).find('a').attr('href');
      const date = $(element).find('span').text();

      // 构建项目对象
      items.push({
        title: title,
        description: title, // 这里简化处理，通常 description 会是更详细的内容
        link: 'https://gzw.cq.gov.cn' + link, // 补全 URL
        pubDate: new Date(date).toUTCString() // 转换日期为 UTC 格式
      });
    });

    return items;
  }
};
