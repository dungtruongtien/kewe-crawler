import express from 'express';

import keywordRouterHandler from './keyword.route'
import userRouterHandler from './user.route'
import authRouterHandler from './auth.route'

const router = express.Router();

router.use('/keyword/v1', keywordRouterHandler);
router.use('/user/v1', userRouterHandler);
router.use('/auth/v1', authRouterHandler);



export default router;