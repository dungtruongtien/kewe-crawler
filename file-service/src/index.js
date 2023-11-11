import logger from 'morgan';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import config from './config/init';
import fileRouterHandler from './routes/file.route';

dotenv.config();

async function startApp() {
  const app = express();
  const corsOptions = {
    origin: 'http://localhost:8081',
  };

  app.use(logger('dev'));
  app.use(cookieParser());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cors(corsOptions));

  app.use(express.static('public'))

  app.use('/health-check', (req, res, next) => { console.log('health check') });
  app.use('/file', fileRouterHandler);

  app.use((err, req, res, next) => {
    console.error(err.stack)
    res.json({
      error: err.error,
      message: err.message
    })
  })

  app.listen(config.port, () => {
    console.log(`⚡️ [server]: Server is running at https://localhost:${config.port}`);
  });

}

startApp();