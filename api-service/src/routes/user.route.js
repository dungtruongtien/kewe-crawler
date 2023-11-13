import express from 'express';
import { handleMeCtl, handleRegisterCtr } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
const router = express.Router();

router.post('/register', handleRegisterCtr)

router.get('/me', authenticate, handleMeCtl)


export default router;