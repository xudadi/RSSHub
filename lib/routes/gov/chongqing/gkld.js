const url = require('url');
const got = require('got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const rootUrl = 'https://www.gongkaoleida.com/area/2460-2461-0-2,3,59,78-124';

    try {
        const response = await got(rootUrl);
        const $ = cheerio.load(response.body);
        const listItems = $('ul.news_list li').toArray();

        const items = listItems.slice(0, 10).map((item) => {
            const title = $(item).find('a').text().trim();
            const link = url.resolve(rootUrl, $(item).find('a').attr('href'));
            const pubDate = new Date($(item).find('span').text().trim()).toUTCString();

            return {
                title,
                link,
                pubDate,
            };
        });

        ctx.state.data = {
            title: '公考雷达招考通知',
            link: rootUrl,
            item: items,
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        ctx.state.data = {
            title: 'Error',
            description: 'An error occurred while fetching data.',
        };
    }
};
