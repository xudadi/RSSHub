const Router = require('@koa/router');
const axios = require('axios');
const Parser = require('rss-parser');

const router = new Router();

router.get('/gkld/rss', async (ctx) => {
  try {
    const url = 'https://www.gongkaoleida.com/area/2460-2461-0-2,3,59,78-0,124,125,126,128';
    const response = await axios.get(url);
    const parser = new Parser();
    const feed = await parser.parseString(response.data);

    ctx.body = feed;
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = {
      error: 'Internal Server Error'
    };
  }
});

module.exports = router;
