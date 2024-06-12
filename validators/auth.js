import { body } from 'express-validator';

import User from '../models/user.js';

export const signup = [
    body('firstName')
        .exists({ checkFalsy: true })
        .withMessage('You must type a first name'),
    body('lastName')
        .exists({ checkFalsy: true })
        .withMessage('You must type a last name'),
    body('email')
        .exists({ checkFalsy: true })
        .withMessage('You must type an email')
        .isEmail()
        .withMessage('You must type a proper email')
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then((userDoc) => {
                if (userDoc) {
                    return Promise.reject(
                        'E-Mail exists already, please pick a different one.'
                    );
                }
            });
        }),
    body('password', 'The password must be at least 6 chars long')
        .isStrongPassword({ minLength: 6 })
        .trim(),
    body('confirmPassword')
        .exists({ checkFalsy: true })
        .withMessage('You must type a confirmation password')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('The passwords do not match')
        .trim()
];

export const login = [
    body('email')
        .exists({ checkFalsy: true })
        .withMessage('You must type an email')
        .isEmail()
        .withMessage('You must type a proper email'),
    body('password')
        .exists({ checkFalsy: true })
        .withMessage('You must type a password')
        .trim()
];
