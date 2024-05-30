const got = require('got');
const cheerio = require('cheerio');
const { parseDate } = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const url = 'https://www.gongkaoleida.com/area/2460-2461-0-2,3,59,78-124';
    const response = await got(url);
    const $ = cheerio.load(response.data);

    const list = $('.job-list .job-item').map((index, item) => {
        item = $(item);
        const title = item.find('.job-title').text();
        const link = item.find('.job-title a').attr('href');
        const description = item.find('.job-desc').text();
        const pubDate = item.find('.job-date').text(); // 需要解析日期格式
        return {
            title,
            link: `https://www.gongkaoleida.com${link}`,
            description,
            pubDate: parseDate(pubDate, 'YYYY-MM-DD'), // 根据实际日期格式调整
        };
    }).get();

    ctx.state.data = {
        title: '招聘通知 - 公考雷达',
        link: url,
        item: list,
    };
};
