const got = require('got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const city_id = ctx.params.city_id; // 获取城市 ID
    const url = `https://wap.gongkaoleida.com/article/area/2460?city_id=${city_id}`; // 构造完整的 URL

    const response = await got({
        method: 'get',
        url: url,
    });

    const $ = cheerio.load(response.body);
    const list = $('your-selector').toArray(); // 使用 cheerio 来选择你想要的元素

    const result = list.map((item) => {
        const $item = $(item);
        return {
            title: $item.find('title').text(), // 文章标题
            link: $item.find('link').attr('href'), // 文章链接
            description: $item.find('description').text(), // 文章描述
            pubDate: new Date($item.find('pubDate').text()), // 发布日期
        };
    });

    return result;
};
