import express from 'express';
import { handleKeywordCrawlerCtr } from '../controllers/keyword.controller';
const router = express.Router();

router.post('/upload', handleKeywordCrawlerCtr)

export default router;