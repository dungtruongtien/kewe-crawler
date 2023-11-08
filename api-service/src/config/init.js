import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 8081,
  dialect: process.env.DB_DIALECT,
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASS,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
}