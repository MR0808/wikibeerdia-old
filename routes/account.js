import express from 'express';

import * as accountController from '../controllers/account.js';
import * as validators from '../validators/account.js';
import * as sanitizers from '../sanitizers/auth.js';
import isAuth from '../middleware/is-auth.js';
import { userUploadHandler } from '../util/multer-config.js';

const router = express.Router();

router.get('/', isAuth, accountController.getAccount);

// Personal Info

router.get('/personal-info', isAuth, accountController.getPersonalInfo);

router.post(
    '/personal-info/name',
    (res, req, next) => isAuth(res, req, next, 'user'),
    ...validators.personalInfoName,
    accountController.postPersonalInfoName
);

router.post(
    '/personal-info/gender',
    (res, req, next) => isAuth(res, req, next, 'user'),
    ...validators.personalInfoGender,
    accountController.postPersonalInfoGender
);

router.post(
    '/personal-info/location',
    (res, req, next) => isAuth(res, req, next, 'user'),
    ...validators.personalInfoLocation,
    accountController.postPersonalInfoLocation
);

router.post(
    '/personal-info/dob',
    (res, req, next) => isAuth(res, req, next, 'user'),
    ...validators.personalInfoDob,
    accountController.postPersonalInfoDob
);

router.post(
    '/personal-info/profile',
    (res, req, next) => isAuth(res, req, next, 'user'),
    userUploadHandler.fields([{ name: 'profilePicture', maxCount: 1 }]),
    accountController.postPersonalInfoProfile
);

router.post(
    '/personal-info/removeprofile',
    (res, req, next) => isAuth(res, req, next, 'user'),
    accountController.postPersonalInfoRemoveProfile
);

// Login and Security

router.get(
    '/security',
    (res, req, next) => isAuth(res, req, next, 'user'),
    accountController.getSecurity
);

router.post(
    '/security/email',
    (res, req, next) => isAuth(res, req, next, 'user'),
    ...validators.securityEmail,
    accountController.postSecurityEmail
);

router.post(
    '/security/resendEmail',
    (res, req, next) => isAuth(res, req, next, 'user'),
    accountController.postSecurityResendEmail
);

router.post(
    '/security/username',
    (res, req, next) => isAuth(res, req, next, 'user'),
    ...validators.securityUsername,
    accountController.postSecurityUsername
);

router.post(
    '/security/password',
    (res, req, next) => isAuth(res, req, next, 'user'),
    ...validators.securityPassword,
    accountController.postSecurityPasword
);

export default router;
