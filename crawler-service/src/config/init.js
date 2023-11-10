import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 8081,
  database: {
    dialect: process.env.DB_DIALECT,
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
    dbPort: process.env.DB_PORT,
  },
  messageQueue: {
    amqpHost: process.env.AMQP_HOST,
    amqpPort: process.env.AMQP_PORT,
    amqpUser: process.env.AMQP_USER,
    amqpPassword: process.env.AMQP_PASSWORD,
  }
}