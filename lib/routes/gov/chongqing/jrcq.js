// 导入所需模块
const got = require('got');
const cheerio = require('cheerio');
const { parseDate } = require('@/utils/parse-date'); // 假设此函数用于解析日期

module.exports = async (ctx) => {
  // 页面URL，请替换为实际的网址
  const baseUrl = 'https://www.cq.gov.cn/ywdt/jrcq/';
  const currentPageUrl = `${baseUrl}/index.html`; // 初始页面或当前页URL
  
  // 发起HTTP请求获取页面内容
  const response = await got(currentPageUrl);
  const $ = cheerio.load(response.body);

  // 解析当前页的数据
  const items = [];
  $('ul.tab-item').each((index, element) => {
    $(element).find('li').each((liIndex, liElement) => {
      const title = $(liElement).find('a').text(); // 职位标题
      const link = $(liElement).find('a').attr('href'); // 职位链接
      const dateStr = $(liElement).find('span').text().trim(); // 发布日期文本
      const pubDate = parseDate(dateStr, 'YYYY-MM-DD'); // 解析日期
      
      items.push({
        title: title,
        link: baseUrl + link, // 确保链接是完整的
        pubDate: pubDate,
      });
    });
  });

  // 处理分页，这里仅示例了基本逻辑，具体实现可能需要根据实际情况调整
  const pagination = $('.pagination');
  let nextPageLink = null;
  pagination.find('a.last-page').each((i, el) => {
    nextPageLink = $(el).attr('href');
  });

  // 如果有下一页，递归抓取并合并数据
  if (nextPageLink) {
    const nextPageItems = await fetchPageItems(baseUrl + nextPageLink);
    items.push(...nextPageItems);
  }

  // 设置最终的RSS feed数据
  ctx.state.data = {
    title: '今日重庆',
    link: currentPageUrl,
    description: '今日重庆信息聚合',
    item: items,
  };
};

// 辅助函数，用于递归抓取分页数据
async function fetchPageItems(url) {
  const response = await got(url);
  const $ = cheerio.load(response.body);
  const items = [];
  
  // 同上，进行数据提取...
  
  return items;
}
