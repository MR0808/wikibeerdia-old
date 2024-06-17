import express from 'express';

import * as breweryController from '../controllers/brewery.js';
import * as validators from '../validators/brewery.js';
import isAuth from '../middleware/is-auth.js';

const router = express.Router();

router.get('/add-brewery', isAuth, breweryController.getAddBrewery);

router.post(
    '/add-brewery',
    isAuth,
    ...validators.addBrewery,
    breweryController.postAddBrewery
);

export default router;
