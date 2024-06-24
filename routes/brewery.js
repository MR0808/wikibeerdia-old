import express from 'express';

import * as breweryController from '../controllers/brewery.js';
import * as validators from '../validators/brewery.js';
import isAuth from '../middleware/is-auth.js';
import { breweryUploadHandler } from '../util/multer-config.js';

const router = express.Router();

router.get('/add-brewery', isAuth, breweryController.getAddBrewery);

router.post(
    '/add-brewery',
    isAuth,
    ...validators.addBrewery,
    breweryUploadHandler.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'breweryImages', maxcount: 20 }
    ]),
    breweryController.postAddBrewery
);

router.get('/brewery/:breweryId', isAuth, breweryController.getBrewery);

export default router;
