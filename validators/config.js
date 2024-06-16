import { body } from 'express-validator';

import BreweryType from '../models/breweryType.js';
import Style from '../models/style.js';
import slugify from '../middleware/slugify.js';

export const breweryType = [
    body('breweryType')
        .exists({ checkFalsy: true })
        .withMessage('You must enter a brewery type')
        .custom(async (value, { req }) => {
            const typeDoc = await BreweryType.findOne({
                slug: slugify(value)
            });
            if (typeDoc) {
                return Promise.reject('Brewery type already exists.');
            }
        })
];

export const style = [
    body('name')
        .exists({ checkFalsy: true })
        .withMessage('You must enter a style')
        .custom(async (value, { req }) => {
            const styleDoc = await Style.findOne({
                slug: slugify(value)
            });
            if (styleDoc) {
                return Promise.reject('Style already exists.');
            }
        })
];
