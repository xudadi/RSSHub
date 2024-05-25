const url = require('url');
const got = require('got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const rootUrl = 'https://rlsbj.cq.gov.cn/zwxx_182/tzgg/';

    try {
        const response = await got(rootUrl);
        const $ = cheerio.load(response.body);
        const list = $('div.page-list.clearfix ul li')
            .slice(0, 10)
            .map((_, item) => {
                item = $(item);
                const a = item.find('a');

                return {
                    title: a.text(),
                    link: url.resolve(rootUrl, a.attr('href')),
                    pubDate: new Date(item.find('span').text() + ' GMT+8').toUTCString(),
                };
            })
            .get();

        const items = await Promise.all(
            list.map(async (item) => {
                try {
                    const detailResponse = await got(item.link);
                    const content = cheerio.load(detailResponse.body);

                    item.description = content('div.zwxl-article').html();
                    return item;
                } catch (error) {
                    console.error('Error fetching detail:', error);
                    return null;
                }
            })
        );

        ctx.state.data = {
            title: '重庆人力社保局-通知公告',
            link: rootUrl,
            item: items.filter((item) => item !== null),
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        ctx.state.data = {
            title: 'Error',
            description: 'An error occurred while fetching data.',
        };
    }
};
