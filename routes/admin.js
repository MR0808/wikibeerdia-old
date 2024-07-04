import express from 'express';

import * as adminController from '../controllers/admin.js';
import * as validators from '../validators/admin.js';
import * as sanitizers from '../sanitizers/admin.js';
import isAuth from '../middleware/is-auth.js';

const router = express.Router();

router.get('/login', adminController.getLogin);

router.post('/login', ...validators.login, adminController.postLogin);

router.get('/otp', adminController.getOtpValidation);

export default router;
