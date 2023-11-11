import express from 'express';
import { handleLoginCtl, handleRefreshTokenCtl } from '../controllers/auth.controller';
const router = express.Router();

router.post('/login', handleLoginCtl)

router.post('/token/access', handleRefreshTokenCtl)


export default router;