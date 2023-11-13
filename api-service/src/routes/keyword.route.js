import express from 'express';
import { handleKeywordCrawlerCtr, handleKeywordProcessTrackingCtl, handleListKeywordCtr } from '../controllers/keyword.controller';
const router = express.Router();

router.get('/', handleListKeywordCtr)

router.get('/process/tracking', handleKeywordProcessTrackingCtl)

router.post('/upload', handleKeywordCrawlerCtr)



export default router;