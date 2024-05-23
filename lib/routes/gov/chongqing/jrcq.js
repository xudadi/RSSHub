const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const link = 'https://www.cq.gov.cn/ywdt/jrcq/';
    const response = await got(link);
    const $ = cheerio.load(response.data);

    const items = $('.item-list ul li')
        .slice(0, 10)
        .map((_, item) => {
            item = $(item);
            const title = item.find('a').text();
            const link = item.find('a').attr('href');
            const pubDate = item.find('.date').text();
            const description = item.find('.txt').text();

            return {
                title,
                description,
                pubDate,
                link,
            };
        })
        .get();

    ctx.state.data = {
        title: '重庆市人民政府网 - 今日重庆',
        link,
        item: items,
    };
};
