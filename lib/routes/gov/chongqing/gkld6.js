module.exports = async (ctx) => {
  const axios = require('axios');
  const cheerio = require('cheerio');

  const url = 'https://www.gongkaoleida.com/area/2460-2461-0-2,3,59,78-0,124,125,126,128';

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  };

  try {
    const response = await axios.get(url, { headers });
    const $ = cheerio.load(response.data);
    const linkList = $('ul.link-list');
    const items = [];

    for (const el of linkList.find('li').get()) {
      const title = $(el).find('a').text();
      const href = $(el).find('a').attr('href');
      const articleResponse = await axios.get(href, { headers });
      const article$ = cheerio.load(articleResponse.data);
      const content = article$('div.content').html();
      items.push({ title, href, content });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 等待1秒钟
    }

    return {
      title: '工考雷达链接列表',
      link: 'https://www.gongkaoleida.com',
      description: '工考雷达链接列表',
      item: items.map((item) => ({
        title: item.title,
        description: item.content,
        link: item.href,
      })),
    };
  } catch (error) {
    console.log(error);
    return Promise.reject('Failed to fetch data');
  }
};
