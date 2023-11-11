import sequelizeService from "./client/db.client";
import { crawlerConsumer } from "./services/crawler.service";
var amqp = require('amqplib/callback_api');

sequelizeService.init().then(async () => {
  amqp.connect('amqp://lumens:lumens@localhost:5672', function (error, connection) {
    connection.createChannel(function (error, channel) {
      var queue = 'keyword_crawling';

      channel.assertQueue(queue, {
        durable: true
      });
      channel.prefetch(1);
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
      channel.consume(queue, function (msg) {
        setTimeout(async() => {
          console.log(" [x] Received %s", msg.content.toString());
          const data = JSON.parse(msg.content.toString());
          await crawlerConsumer(data.keyword, data.userId);
          channel.ack(msg);
        }, 5000);
      }, {
        noAck: false
      });
    });
  });
}).catch(error => {
  console.log('error----', error);
})