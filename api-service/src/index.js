import express from 'express';
import dotenv from 'dotenv';
import config from './config/init';
import sequelizeService from './client/db';
import keywordRouter from './routes/keyword.route';
import { initChannel } from './client/amqpClient/init';
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

dotenv.config();

async function bootstrap() {
  // Init db connection
  sequelizeService.init();

  await initChannel()
}

async function startApp() {

  const app = express();
  await bootstrap(app);

  const corsOptions = {
    origin: 'http://localhost:8081',
  };

  app.use(logger('dev'));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));


  app.use(cors(corsOptions));

  app.use('/health-check', (req, res, next) => { console.log('health check') });
  app.use('/keyword', keywordRouter);

  app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(err.statusCode).json({
      error: err.error,
      message: err.message
    })
  })

  app.listen(config.port, () => {
    console.log(`⚡️ [server]: Server is running at https://localhost:${config.port}`);
  });

}

startApp();