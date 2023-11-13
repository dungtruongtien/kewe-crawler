import express from 'express';
import { handleKeywordCrawlerCtr, handleKeywordProcessTrackingCtr, handleListKeywordCtr } from '../controllers/keyword.controller';
const router = express.Router();

router.get('/', handleListKeywordCtr)

router.get('/process/tracking', handleKeywordProcessTrackingCtr)

router.post('/upload', handleKeywordCrawlerCtr)



export default router;