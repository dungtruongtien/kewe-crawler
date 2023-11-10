import amqplib from 'amqplib';
import config from '../../config/init';

export let RABBITMQ_CONN = null;

export const connection = () => {
	return amqplib.connect(`amqp://${config.messageQueue.amqpUser}:${config.messageQueue.amqpPassword}@${config.messageQueue.amqpHost}:${config.messageQueue.amqpPort}/`);
}

export const connect = async () => {
	RABBITMQ_CONN = await connection();
}

export const initChannel = async (callback) => {
	// console.log('RABBITMQ_CONN----', RABBITMQ_CONN);
	const channel = await RABBITMQ_CONN.createChannel();
	channel.assertQueue('keyword_crawling', {
		durable: true,
	});
	channel.prefetch(1);
	channel.consume(
		'keyword_crawling',
		function (msg) {
			var secs = msg.content.toString().split('.').length - 1;

			console.log(" [x] Received %s", msg.content.toString());
			console.log(" [x] Done");
			// console.log('channel----', channel);
			// channel.ack(msg);
			// setTimeout(function () {
			// }, secs * 1000);
		},
		{
			noAck: true
		}
	);
}

export const pushToQueue = (queueName, msg) => {
	RABBITMQ_CHANNEL.assertQueue(queueName, {
		durable: false
	});

	RABBITMQ_CHANNEL.sendToQueue(queueName, Buffer.from(msg));
	// console.log("Message sent");
}