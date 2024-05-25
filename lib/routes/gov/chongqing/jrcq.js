const url = require('url');
const got = require('got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const rootUrl = 'https://www.cq.gov.cn/ywdt/jrcq/';

    try {
        const response = await got(rootUrl);
        const $ = cheerio.load(response.body);
        const list = $('ul.newslist li')
            .slice(0, 10)
            .map((_, item) => {
                item = $(item);
                const a = item.find('a');

                return {
                    title: a.text().trim(),
                    link: url.resolve(rootUrl, a.attr('href')),
                    pubDate: new Date(item.find('span').text().trim()).toUTCString(),
                };
            })
            .get();

        const items = await Promise.all(
            list.map(async (item) => {
                try {
                    const detailResponse = await got(item.link);
                    const content = cheerio.load(detailResponse.body);

                    item.description = content('div.newscontent').html();
                    return item;
                } catch (error) {
                    console.error('Error fetching detail:', error);
                    return null;
                }
            })
        );

        ctx.state.data = {
            title: '重庆政府网-今日重庆',
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
