module.exports = {
    name: '重庆市国有资产监督管理委员会国企招聘',
    route: 'https://gzw.cq.gov.cn/gqzp',
    async fetch() {
        const html = await this.fetch(this.route);
        const $ = this.cheerio.load(html);
        const items = [];

        $('ul.tab-item > li').each((index, element) => {
            const title = $(element).find('a').text().trim();
            const link = $(element).attr('href');
            const date = $(element).find('span').text().trim();

            items.push({
                title,
                link: `https://gzw.cq.gov.cn${link}`,
                description: title, // 这里可以根据需要提供更详细的描述
                pubDate: new Date(date).toUTCString(),
            });
        });

        return items;
    },
    render: (items) => {
        const feed = this.rss({
            title: '重庆市国有资产监督管理委员会国企招聘',
            description: '重庆市国有资产监督管理委员会国企招聘信息',
            link: this.route,
            language: 'zh-cn',
            items,
        });

        return feed;
    },
};
