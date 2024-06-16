import { body } from 'express-validator';

import Brewery from '../models/breweryType.js';
import slugify from '../middleware/slugify.js';

export const addBrewery = [
    body('name')
        .exists({ checkFalsy: true })
        .withMessage('You must enter a brewery type')
        .custom(async (value, { req }) => {
            const breweryDoc = await Brewery.findOne({
                slug: slugify(value)
            });
            if (breweryDoc) {
                return Promise.reject('Brewery type already exists.');
            }
        })
];
