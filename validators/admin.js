import { body } from 'express-validator';

import User from '../models/user.js';
import Country from '../models/country.js';
import State from '../models/state.js';
import BreweryTypes from '../models/breweryType.js';
import slugify from '../middleware/slugify.js';

export const login = [
    body('email')
        .exists({ checkFalsy: true })
        .withMessage('Please enter an email/username'),
    body('password')
        .exists({ checkFalsy: true })
        .withMessage('You must type a password')
        .trim()
];

export const breweryType = [
    body('name')
        .exists({ checkFalsy: true })
        .withMessage('You must enter a brewery type')
        .custom(async (value, { req }) => {
            const typeDoc = await BreweryTypes.findOne({
                slug: slugify(value)
            });
            if (typeDoc) {
                return Promise.reject('Brewery type already exists.');
            }
        })
];
