import express from 'express';

import { handleUploadFileCtr } from '../controllers/file.controller';

const router = express.Router();

router.post('/upload', handleUploadFileCtr)

export default router;