import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 8081,
  nodeEnv: process.env.NODE_ENV || 'development',
  fileServerHost: process.env.FILE_SERVER_HOST || 'development',
  database: {
    dialect: process.env.DB_DIALECT,
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
    dbPort: process.env.DB_PORT,
  },
  memCache: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  messageQueue: {
    amqpHost: process.env.AMQP_HOST,
    amqpPort: process.env.AMQP_PORT,
    amqpUser: process.env.AMQP_USER,
    amqpPassword: process.env.AMQP_PASSWORD,
  }
}