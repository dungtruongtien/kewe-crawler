import express from 'express';
import { handleMeCtl, handleRegisterCtr } from '../controllers/user.controller';
const router = express.Router();

router.post('/register', handleRegisterCtr)

router.get('/me', handleMeCtl)


export default router;