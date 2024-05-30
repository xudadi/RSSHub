const got = require('@/utils/got');
const cheerio = require('cheerio');
const { parseDate } = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const url = 'https://www.gongkaoleida.com/area/2460-2461-0-2,3,59,78-124';
    const response = await got(url);
    
    // 确保 response.data 是一个字符串
    const htmlString = response.data;
    const $ = cheerio.load(htmlString);

    const list = $('.news-list ul li').map((index, item) => {
        item = $(item);
        const title = item.find('.name a').text();
        const link = item.find('.name a').attr('href');
        const pubDate = item.find('.time').text(); // 需要解析日期格式
        return {
            title,
            link: `https://www.gongkaoleida.com${link}`,
            pubDate: parseDate(pubDate, 'YYYY-MM-DD'), // 根据实际日期格式调整
        };
    }).get();

    ctx.state.data = {
        title: '招聘通知 - 公考雷达',
        link: url,
        item: list,
    };
};
