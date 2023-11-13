var amqp = require('amqplib/callback_api');

import sequelizeService from "./client/db.client";
import { initMemcache } from "./client/redis.client";
import { CRAWLER_QUEUE_NAME } from "./common/constant";
import { crawlerConsumer } from "./services/crawler.service";
import config from './config/init';



sequelizeService.init().then(async () => {
  await initMemcache();
  amqp.connect(`amqp://${config.messageQueue.amqpUser}:${config.messageQueue.amqpPassword}@${config.messageQueue.amqpHost}:${config.messageQueue.amqpPort}/`, function (error, connection) {
    connection.createChannel(function (error, channel) {
      var queue = CRAWLER_QUEUE_NAME;

      channel.assertQueue(queue, {
        durable: true
      });
      channel.prefetch(1);
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
      channel.consume(queue, function (msg) {
        try {
          setTimeout(async() => {
            console.log(" [x] Received %s", msg.content.toString());
            const data = JSON.parse(msg.content.toString());
            await crawlerConsumer(data);
            channel.ack(msg);
            console.log('Consumer DONE');
          }, 5000);
        } catch (error) {
          //TODO: define rule to send ack or not, currently dont send ack when consumer failed
        }
      }, {
        noAck: false
      });
    });
  });
}).catch(error => {
  console.log('error----', error);
})