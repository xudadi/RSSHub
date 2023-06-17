module.exports = (ctx) => {
  const axios = require('axios');
  const cheerio = require('cheerio');

  const url = 'https://www.gongkaoleida.com/area/2460-2461-0-2,3,59,78-0,124,125,126,128';

  return axios.get(url)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const linkList = $('ul.link-list');
      const items = [];

      linkList.find('li').each((i, el) => {
        const title = $(el).find('a').text();
        const href = $(el).find('a').attr('href');
        items.push({ title, href });
      });

      return {
        title: '工考雷达链接列表',
        link: 'https://www.gongkaoleida.com',
        description: '工考雷达链接列表',
        item: items.map((item) => ({
          title: item.title,
          description: item.title,
          link: item.href,
        })),
      };
    })
    .catch((error) => {
      console.log(error);
      return Promise.reject('Failed to fetch data');
    });
};
