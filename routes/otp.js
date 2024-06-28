import express from 'express';

import * as otpController from '../controllers/otp.js';
import isAuth from '../middleware/is-auth.js';

const router = express.Router();

router.post(
    '/generate',
    (res, req, next) => isAuth(res, req, next, 'user'),
    otpController.postGenerateOtp
);

router.post(
    '/verify',
    (res, req, next) => isAuth(res, req, next, 'user'),
    otpController.postVerifyOtp
);

router.post(
    '/disable',
    (res, req, next) => isAuth(res, req, next, 'user'),
    otpController.postDisableOtp
);

router.post(
    '/resetcodes',
    (res, req, next) => isAuth(res, req, next, 'user'),
    otpController.postResetCodes
);

router.post('/validate', otpController.postValidateOtp);

router.post('/recovery', otpController.postValidateRecoveryCode);

export default router;
