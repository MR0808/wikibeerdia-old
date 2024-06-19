import express from 'express';

import * as accountController from '../controllers/account.js';
import isAuth from '../middleware/is-auth.js';

const router = express.Router();

router.get('/', isAuth, accountController.getAccount);

router.get('/personal-info', isAuth, accountController.getPersonalInfo);

export default router;
