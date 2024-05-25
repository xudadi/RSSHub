const url = require('url');
const got = require('got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const rootUrl = 'https://www.gongkaoleida.com/area/2460-2461-0-2,3,59,78-124';

    try {
        const response = await got(rootUrl);
        const $ = cheerio.load(response.body);

        // 修改选择器以匹配正确的列表结构
        const list = $('div.news_list ul li').map((_, item) => {
            item = $(item);
            const a = item.find('a');
            return {
                title: a.text().trim(),
                link: url.resolve(rootUrl, a.attr('href')),
                pubDate: new Date(item.find('span').text().trim() + ' GMT+8').toUTCString(),
            };
        }).get();

        const items = await Promise.all(
            list.map(async (item) => {
                try {
                    const detailResponse = await got(item.link);
                    const content = cheerio.load(detailResponse.body);

                    item.description = content('div.content').html(); // 修改为正确的详情内容选择器
                    return item;
                } catch (error) {
                    console.error('Error fetching detail:', error);
                    return null;
                }
            })
        );

        ctx.state.data = {
            title: '招考通知',
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
