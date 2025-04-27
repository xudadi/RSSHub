module.exports = (ctx) => {
    const rp = require('request-promise');
    const cheerio = require('cheerio');

    return rp({
        uri: 'https://cq.jinbiaochi.com/jsgz/column_114/',
        headers: {
            'User-Agent': 'RSSHub'
        },
        transform: (body) => cheerio.load(body)
    }).then(($) => {
        const items = [];
        $('[ 招考公告 ]').each((index, element) => {
            const title = $(element).text().trim();
            const link = $(element).parent().attr('href');
            const date = $(element).next().text().trim();

            items.push({
                title,
                link,
                pubDate: new Date(date)
            });
        });

        ctx.state.data = {
            title: '重庆教师招聘公告',
            link: 'https://cq.jinbiaochi.com/jsgz/column_114/',
            description: '重庆地区教师招聘公告汇总',
            item: items
        };
    });
};
