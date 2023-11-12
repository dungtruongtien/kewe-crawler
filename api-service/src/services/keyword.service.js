import Keyword from '../models/keyword.model';
import { GLOBAL_MQ_CONN, pushToQueue } from '../client/amqpClient/init';

export const handleKeywordCrawlerSv = async ({ listKeywords, userId }) => {
  // Push to redis for tracking
  // Loop all listKeywords
  //  Push to queue
  const mqChannel = await GLOBAL_MQ_CONN.createChannel();
  const promiseAll = listKeywords.map((keyword) => {
    return new Promise((resolve, reject) => {
      const message = {
        keyword,
        userId
      }
      pushToQueue(mqChannel, 'keyword_crawling', JSON.stringify(message));
      resolve('DONE');
    })
  });
  await Promise.all(promiseAll);
}


export const handleListKeywordSv = async ({ userId, limit = 5, offset = 0, attributes }) => {
  const filter = {
    userId,
  }
  return Keyword.findAndCountAll({
    where: filter,
    order: [['id', 'DESC']],
    attributes,
    limit,
    offset
  });
}