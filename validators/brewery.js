import { body } from 'express-validator';

import Brewery from '../models/breweryType.js';
import slugify from '../middleware/slugify.js';

export const addBrewery = [
    body('name').exists({ checkFalsy: true }).trim(),
    body('city').exists({ checkFalsy: true }),
    body('description').isLength({ min: 10 }).trim(),
    body('website').exists({ checkFalsy: true }).isURL(),
    body('type').exists({ checkFalsy: true })
];
