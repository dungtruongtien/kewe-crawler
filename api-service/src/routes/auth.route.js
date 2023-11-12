import express from 'express';
import { handleLoginCtl, handleLogoutCtl, handleRefreshTokenCtl } from '../controllers/auth.controller';
const router = express.Router();

router.post('/login', handleLoginCtl);

router.post('/logout', handleLogoutCtl);

router.post('/token/access', handleRefreshTokenCtl);


export default router;