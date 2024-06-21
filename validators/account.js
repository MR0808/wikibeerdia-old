import { body } from 'express-validator';

import User from '../models/user.js';
import Country from '../models/country.js';
import State from '../models/state.js';

export const personalInfoName = [
    body('firstName').exists({ checkFalsy: true }),
    body('lastName').exists({ checkFalsy: true })
];

export const personalInfoGender = [body('gender').exists({ checkFalsy: true })];

export const personalInfoLocation = [
    body('country').exists({ checkFalsy: true }),
    body('state')
        .if(body('country').notEmpty())
        .custom(async (value, { req }) => {
            const states = await State.countDocuments({
                country: req.body.country
            });
            if (states > 0) {
                if (!value) {
                    throw new Error('No state selected');
                }
            }
            return true;
        })
];

export const personalInfoDob = [
    body('dateOfBirth')
        .exists({ checkFalsy: true })
        .isDate({ format: 'YYYY-MM-DD' })
        .custom((value) => {
            const dob = new Date(value);
            const year = dob.getFullYear();
            const today = new Date();
            const age = today.getFullYear() - year;
            if (age < 18) {
                throw new Error('User is under 18');
            } else {
                return true;
            }
        })
];
