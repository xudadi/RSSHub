const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const baseUrl = 'https://www.gongkaoleida.com';
    const url = `${baseUrl}/area/2460-2461-0-2,3,59,78-0,124,125,126,128`;

    const response = await got({
        method: 'get',
        url: url,
        headers: {
            Referer: baseUrl,
        },
    });

    const data = response.data;
    const $ = cheerio.load(data);
    const title = $('title').text();
    const list = $('.newlist li');

    ctx.state.data = {
        title: `${title} - 公考雷达`,
        link: url,
        item:
            list &&
            list
                .map((_, item) => {
                    item = $(item);
                    const link = baseUrl + item.find('.title a').attr('href');
                    return {
                        title: item.find('.title a').text(),
                        description: item.find('.restxt').html(),
                        pubDate: new Date(item.find('.time').text()).toUTCString(),
                        link: link,
                        guid: link,
                    };
                })
                .get(),
    };
};
