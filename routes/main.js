import express from 'express';

import * as mainController from '../controllers/main.js';
import isAuth from '../middleware/is-auth.js';

const router = express.Router();

router.get('/', mainController.getIndex);

export default router;
