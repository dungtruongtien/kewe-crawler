import express from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import config from './config/init';
import sequelizeService from './client/db';
import keywordRouter from './routes/keyword.route';
import userRouter from './routes/user.route';
import { initConnection } from './client/amqpClient/init';

dotenv.config();

async function bootstrap() {
  // Init db connection
  sequelizeService.init();
  await initConnection()
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
  app.use('/user', userRouter);

  app.use((err, req, res, next) => {
    //TODO: Handler logger for error level
    if(config.nodeEnv === 'development') {
      console.log(err)
    }

    if(!err.status || err.status >= 500 && err.status <= 599) {
      err.status = 500;
      err.name = 'INTERNAL_ERROR';
      err.message = 'Internal error';
    }
    res.status(err.status).json({
      name: err.name,
      message: err.message
    })
  })

  app.listen(config.port, () => {
    console.log(`⚡️ [server]: Server is running at https://localhost:${config.port}`);
  });

}

startApp();