import express from 'express';

import * as authController from '../controllers/auth.js';
import * as validators from '../validators/auth.js';
import * as sanitizers from '../sanitizers/auth.js';

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', ...validators.login, authController.postLogin);

router.get('/signup', authController.getSignup);

router.post(
    '/signup',
    ...validators.signup,
    ...sanitizers.email,
    authController.postSignup
);

router.get('/confirmation/:token', authController.getConfirmation);

router.post('/resend', authController.postResendToken);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', ...validators.reset, authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post(
    '/new-password',
    ...validators.resetPassword,
    authController.postNewPassword
);

export default router;
