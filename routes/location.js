import express from 'express';

import * as locationController from '../controllers/location.js';

const router = express.Router();

router.get('/cities', locationController.getCities);

export default router;
