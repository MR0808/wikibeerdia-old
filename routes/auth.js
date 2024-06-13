import express from 'express';

import * as authController from '../controllers/auth.js';
import * as validators from '../validators/auth.js';
import * as sanitizers from '../sanitizers/auth.js';

const router = express.Router();

// router.get('/login', authController.getLogin);

// router.post(
//     '/login',
//     ...validators.login,
//     ...sanitizers.signup,
//     authController.postLogin
// );

router.get('/signup', authController.getSignup);

router.post('/signup', ...validators.signup, authController.postSignup);

router.get('/finished', authController.getFinished);

router.get('/confirmation/:token', authController.getConfirmation);

router.post('/resend', authController.postResendToken);

// router.post('/logout', authController.postLogout);

// router.get('/reset', authController.getReset);

// router.post('/reset', authController.postReset);

// router.get('/reset/:token', authController.getNewPassword);

// router.post('/new-password', authController.postNewPassword);

export default router;
