const axios = require('axios');
const cheerio = require('cheerio');

async function fetchJobListings() {
    const url = 'https://www.gongkaoleida.com/area/2460-2461-0-2,3,59,78-124';
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // 根据网页结构调整选择器
        const jobListItems = $('article.item').map((index, element) => {
            const title = $(element).find('.title').text().trim();
            const link = $(element).find('.title a').attr('href');
            const pubDateRaw = $(element).find('.time').text(); // 假设时间信息在类为.time的元素内
            const pubDate = new Date(pubDateRaw + ' GMT+0800').toISOString();

            return {
                title,
                link: link ? `${url}${link}` : '#', // 确保链接是完整的
                pubDate,
            };
        }).get();

        return jobListItems;
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        return [];
    }
}

// 示例：调用函数并打印结果
fetchJobListings().then(jobs => {
    console.log(JSON.stringify(jobs, null, 2));
}).catch(error => console.error(error));

// 实际应用中，您可能需要将此部分替换为RSS feed生成逻辑
