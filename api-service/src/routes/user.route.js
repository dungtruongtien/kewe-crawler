import express from 'express';
import { handleRegisterCtr } from '../controllers/user.controller';
const router = express.Router();

router.post('/register', handleRegisterCtr)

// router.get('/me', handleListKeywordCtr)


export default router;