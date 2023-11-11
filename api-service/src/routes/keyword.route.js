import express from 'express';
import { handleKeywordCrawlerCtr, handleListKeywordCtr } from '../controllers/keyword.controller';
const router = express.Router();

router.get('/', handleListKeywordCtr)

router.post('/upload', handleKeywordCrawlerCtr)


export default router;