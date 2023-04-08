const url = require('url');
const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const rootUrl = 'https://rlsbj.cq.gov.cn/ywzl/rsks/sydwks/';

    const response = await got({
        method: 'get',
        url: rootUrl,
    });
    const $ = cheerio.load(response.data);
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
        list.map((item) =>
            ctx.cache.tryGet(item.link, async () => {
                const detailResponse = await got({
                    method: 'get',
                    url: item.link,
                });
                const content = cheerio.load(detailResponse.data);

                item.description = content('div.zwxl-article').html();
                return item;
            })
        )
    );

    ctx.state.data = {
        title: '重庆人力社保局-事业单位及其他考试',
        link: rootUrl,
        item: items,
    };
};
