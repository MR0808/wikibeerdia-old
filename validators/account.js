import { body } from 'express-validator';

import User from '../models/user.js';
import Country from '../models/country.js';
import State from '../models/state.js';

export const personalInfoName = [
    body('firstName').exists({ checkFalsy: true }),
    body('lastName').exists({ checkFalsy: true })
];
