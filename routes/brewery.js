import express from 'express';

import * as breweryController from '../controllers/brewery.js';
import * as validators from '../validators/brewery.js';

const router = express.Router();

router.get('/add-brewery', breweryController.getAddBrewery);

export default router;
