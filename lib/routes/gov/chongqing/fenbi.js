const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const link = 'https://www.fenbi.com/page/fenxiaozhaokao/25';
    const response = await got.get(link);
    const $ = cheerio.load(response.data);
    const title = $('title').text();

    const list = $('ul.list-group > li')
        .map((_, item) => {
            item = $(item);
            const title = item.find('a').text();
            const pubDate = new Date(item.find('.date').text()).toUTCString();
            const link = item.find('a').attr('href');

            return {
                title,
                pubDate,
                link,
            };
        })
        .get();

    ctx.state.data = {
        title,
        link,
        item: list,
    };
};
