import express from 'express';

import * as configController from '../controllers/config.js';
import * as validators from '../validators/config.js';

const router = express.Router();

router.post(
    '/brewery-type',
    ...validators.breweryType,
    configController.postBreweryType
);

router.post('/style', ...validators.style, configController.postAddStyle);

router.get('/style', configController.getStyleDescendants);

export default router;
