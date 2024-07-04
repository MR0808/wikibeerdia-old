import { body } from 'express-validator';

import User from '../models/user.js';
import Country from '../models/country.js';
import State from '../models/state.js';

export const login = [
    body('email')
        .exists({ checkFalsy: true })
        .withMessage('Please enter an email/username'),
    body('password')
        .exists({ checkFalsy: true })
        .withMessage('You must type a password')
        .trim()
];
