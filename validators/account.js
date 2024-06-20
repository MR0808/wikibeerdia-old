import { body } from 'express-validator';

import User from '../models/user.js';
import Country from '../models/country.js';
import State from '../models/state.js';

export const personalInfo = [
    body('firstName').exists({ checkFalsy: true }),
    body('lastName').exists({ checkFalsy: true }),
    body('gender').exists({ checkFalsy: true }),
    body('dateOfBirth')
        .isDate({ format: 'Y-m-d' })
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
        }),
    body('country').exists({ checkFalsy: true }),
    body('state').custom(async (value, { req }) => {
        console.log(req.body.country);
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
