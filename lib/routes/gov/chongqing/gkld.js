// rsshub-route.js
module.exports = (router) => {
  router.route('/gongkaoleida/list')
    .get(async (ctx) => {
      const url = 'https://www.gongkaoleida.com/area/2460-2461-0-2,3,59,78-124';
      const response = await ctx.cache.tryGet(url, async () => {
        const res = await got.get(url);
        return res.data;
      });

      const items = []; // 存储解析后的招聘信息条目

      // 假设招聘信息在页面上有特定的结构，如class="job-listing"的元素
      const parser = new DOMParser();
      const doc = parser.parseFromString(response, 'text/html');
      const jobListings = doc.querySelectorAll('body > section > div.mdn-content-box.clearfix > div > div > div.notice-list'); // 需根据实际HTML结构调整选择器

      jobListings.forEach((listing) => {
        const title = listing.querySelector('body > section > div.mdn-content-box.clearfix > div > div > div.notice-list > ul > li:nth-child(1) > h5 > a').textContent; // 假定的标题选择器
        const link = listing.querySelector('body > section > div.mdn-content-box.clearfix > div > div > div.notice-list > ul > li:nth-child(1) > h5 > a').href; // 假定的链接选择器
        const pubDate = listing.querySelector('body > section > div.mdn-content-box.clearfix > div > div > div.notice-list > ul > li:nth-child(1) > time').textContent; // 假定的发布日期选择器

        items.push({
          title: title.trim(),
          link: link,
          pubDate: new Date(pubDate.trim()).toUTCString(), // 转换日期格式
          author: '重庆市公考雷达',
          category: listing.querySelector('.category').textContent.trim() || '未知类别', // 可选的分类信息
        });
      });

      ctx.state.data = {
        title: '重庆市公考雷达 - 招考信息列表',
        link: url,
        description: '最新重庆市公务员及各类企事业单位招考信息汇总',
        item: items,
      };
    });

};
