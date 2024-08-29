const cheerio = require('cheerio');

module.exports = async (ctx) => {
  const areaId = '2460-2461-0-2,3,59,78-124'; // 区域ID，可以根据需要修改
  const url = `https://www.gongkaoleida.com/area/${areaId}`;
  
  const res = await ctx.cache.tryGet(url, async () => {
    const response = await ctx.fetch(url);
    return response.data;
  });

  const $ = cheerio.load(res);
  const items = [];

  $('.item').each(function () {
    const title = $(this).find('.title').text();
    const link = $(this).find('a').attr('href');
    const description = $(this).find('.description').text();

    items.push({
      title: title,
      link: link,
      description: description,
    });
  });

  ctx.state.data = {
    title: '公考雷达 - 考试成绩查询', // 根据网站内容设置
    link: url,
    description: '公考雷达考试成绩查询', // 根据网站内容设置
    item: items,
  };
};
