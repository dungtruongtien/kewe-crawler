import express from 'express';
import { pushToQueue } from '../client/amqpClient/init';
const router = express.Router();

router.post('/upload', async (req, res) => {
  // Handle validate input
  await pushToQueue('testQueue', 'test msg');
  res.send('About birds')
})

export default router;