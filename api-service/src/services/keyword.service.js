import { GLOBAL_MQ_CONN, pushToQueue } from '../client/amqpClient/init';

export const handleKeywordCrawlerSv = async (listKeywords) => {
  // Push to redis for tracking
  // Loop all listKeywords
  //  Push to queue
  const mqChannel = await GLOBAL_MQ_CONN.createChannel();
  const promiseAll = listKeywords.map((keyword) => {
    return new Promise((resolve, reject) => {
      const message = {
        keyword,
        userId: 1
      }
      pushToQueue(mqChannel, 'keyword_crawling', JSON.stringify(message));
      resolve('DONE');
    })
  });
  await Promise.all(promiseAll);
}