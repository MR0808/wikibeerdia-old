import express from 'express';

import * as adminController from '../controllers/admin.js';
import * as validators from '../validators/admin.js';
import * as sanitizers from '../sanitizers/admin.js';
import isAuth from '../middleware/is-auth.js';

const router = express.Router();

router.get(
    '/',
    (res, req, next) => isAuth(res, req, next, 'admin'),
    adminController.getIndex
);

router.get('/login', adminController.getLogin);

router.post('/login', ...validators.login, adminController.postLogin);

router.get('/otp', adminController.getOtpValidation);

router.get(
    '/users/list/',
    (res, req, next) => isAuth(res, req, next, 'admin'),
    adminController.getUserList
);

router.get(
    '/brewery-types/',
    (res, req, next) => isAuth(res, req, next, 'admin'),
    adminController.getBreweryTypes
);

router.get(
    '/brewery-types/',
    (res, req, next) => isAuth(res, req, next, 'admin'),
    adminController.getBreweryTypes
);

router.post(
    '/brewery-types/',
    (res, req, next) => isAuth(res, req, next, 'admin'),
    ...validators.breweryType,
    adminController.postBreweryTypes
);

export default router;
