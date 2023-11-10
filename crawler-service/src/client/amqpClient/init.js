import amqplib from 'amqplib';
import config from '../../config/init';

export let RABBITMQ_CHANNEL = null;

export const connection = () => {
	return amqplib.connect(`amqp://${config.messageQueue.amqpUser}:${config.messageQueue.amqpPassword}@${config.messageQueue.amqpHost}:${config.messageQueue.amqpPort}/`);
}

export const initChannel = async () => {
	const conn = await connection();
	RABBITMQ_CHANNEL = await conn.createChannel();
}

export const pushToQueue = (queueName, msg) => {
	RABBITMQ_CHANNEL.assertQueue(queueName, {
		durable: false
	});

	RABBITMQ_CHANNEL.sendToQueue(queueName, Buffer.from(msg));
	// console.log("Message sent");
}