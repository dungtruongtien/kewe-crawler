import Keyword from '../models/keyword.model';
import { GLOBAL_MQ_CONN, pushToQueue } from '../client/amqpClient/init';
import { get, set } from '../client/redis';

export const handleKeywordCrawlerSv = async ({ listKeywords, userId }) => {
  // Push to redis for tracking
  // Loop all listKeywords
  //  Push to queue
  const mqChannel = await GLOBAL_MQ_CONN.createChannel();

  //Save to memcache for tracking process
  const trackingKey = `crawler_tracking_${userId}_${new Date().getTime()}`;
  const data = await set(trackingKey, JSON.stringify({ listKeywords, total: listKeywords.length }));
  if (!data || data !== 'OK') {
    throw new Error(`Cannot write tracking process ${trackingKey} to memcache`);
  }

  //Push to every single message queue
  const promiseAll = listKeywords.map((keyword) => {
    return new Promise((resolve, reject) => {
      const message = {
        totalKeywords: listKeywords.length,
        trackingKey,
        keyword,
        userId
      }
      pushToQueue(mqChannel, 'keyword_crawling', JSON.stringify(message));
      resolve('DONE');
    })
  });
  await Promise.all(promiseAll);

  return { trackingKey };
}

export const handleKeywordProcessTrackingSV = async ({ trackingKey }) => {
  return get(trackingKey);
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