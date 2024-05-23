const cheerio = require('cheerio');
const axios = require('axios');

module.exports = {
  name: '重庆国企招聘信息',
  route: 'https://gzw.cq.gov.cn/gqzp/*',
  async fetch(url, req) {
    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);
      const items = [];

      $('ul.tab-item > li').each((index, element) => {
        const title = $(element).find('a').text().trim();
        const link = $(element).find('a').attr('href');
        const date = $(element).find('span').text().trim();

        // 补全 URL（如果链接不是绝对路径）
        if (!link.startsWith('http')) {
          link = 'https://gzw.cq.gov.cn' + link;
        }

        items.push({
          title: title,
          link: link,
          pubDate: new Date(date).toUTCString(),
          description: title
        });
      });

      return items;
    } catch (error) {
      console.error('Fetch error:', error);
      return [];
    }
  },
  render: (items, req) => {
    const rss = `
      <?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>重庆国企招聘信息</title>
          <link>https://gzw.cq.gov.cn/gqzp/</link>
          <description>重庆国企招聘信息 RSS Feed</description>
          <language>zh-cn</language>
          <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
          ${items.map(item => `
            <item>
              <title>${item.title}</title>
              <link>${item.link}</link>
              <description>${item.description}</description>
              <pubDate>${item.pubDate}</pubDate>
            </item>
          `).join('')}
        </channel>
      </rss>
    `;

    return rss;
  }
};
