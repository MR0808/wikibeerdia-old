import express from 'express';

import * as accountController from '../controllers/account.js';
import * as validators from '../validators/account.js';
import * as sanitizers from '../sanitizers/auth.js';
import isAuth from '../middleware/is-auth.js';
import { userUploadHandler } from '../util/multer-config.js';

const router = express.Router();

router.get('/', isAuth, accountController.getAccount);

router.get('/personal-info', isAuth, accountController.getPersonalInfo);

router.post(
    '/personal-info/name',
    isAuth,
    ...validators.personalInfoName,
    accountController.postPersonalInfoName
);

export default router;
