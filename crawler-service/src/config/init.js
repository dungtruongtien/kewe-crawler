import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 8081,
  nodeEnv: process.env.NODE_ENV || 'development',
  fileServerHost: process.env.FILE_SERVER_HOST || 'https://file-service.kewecrawling.info',
  fileServerHostLocal: process.env.FILE_SERVER_HOST_LOCAL || 'http://kewe_file_service:8082',// Temporary tricks, because in UAT env, if use fileServerHost -> the request will go to nginx -> nginx will limit body size
  database: {
    dialect: process.env.DB_DIALECT || 'postgres',
    dbHost: process.env.DB_HOST || 'postgres_service',
    dbUser: process.env.DB_USER || 'postgres',
    dbPassword: process.env.DB_PASS || 'postgres',
    dbName: process.env.DB_NAME || 'kewe_crawling',
    dbPort: process.env.DB_PORT || 5432,
  },
  memCache: {
    host: process.env.REDIS_HOST || 'caching_service',
    port: process.env.REDIS_PORT || 6379,
  },
  messageQueue: {
    amqpHost: process.env.AMQP_HOST || 'rabbitmq_service',
    amqpPort: process.env.AMQP_PORT || 5672,
    amqpUser: process.env.AMQP_USER || 'admin',
    amqpPassword: process.env.AMQP_PASSWORD || 'admin',
  }
}