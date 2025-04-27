const got = require('got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const url = 'https://rlsbj.cq.gov.cn/zwxx_182/sydw/sydwgkzp2024_490546/';
    const response = await got(url);
    const $ = cheerio.load(response.body);

    const items = $('.list-item')
      .map((_, item) => {
            const title = $(item).find('a').text().trim();
            const link = new URL($(item).find('a').attr('href'), url).toString();
            const pubDate = new Date($(item).find('.date').text().trim());

            return {
                title,
                link,
                pubDate
            };
        })
      .get();

    ctx.state.data = {
        title: '重庆市事业单位公开招聘信息',
        link: url,
        description: '重庆市事业单位 2024 年公开招聘相关公告',
        item: items
    };
};
