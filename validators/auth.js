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
        .withMessage('Please enter a valid email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then((userDoc) => {
                if (userDoc) {
                    return Promise.reject(
                        'Email exists already, please log in'
                    );
                }
            });
        })
        .normalizeEmail(),
    body(
        'password',
        'The password must be at least 8 characters long, contain one uppercase, one lowercase, one number and a symbol'
    )
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })
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
        .withMessage('Please enter an email')
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .exists({ checkFalsy: true })
        .withMessage('You must type a password')
        .trim()
];

export const reset = [
    body('email')
        .exists({ checkFalsy: true })
        .withMessage('Please enter an email')
        .isEmail()
        .withMessage('Please enter a valid email')
];

export const resetPassword = [
    body(
        'password',
        'The password must be at least 8 characters long, contain one uppercase, one lowercase, one number and a symbol'
    )
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })
        .trim(),
    body('confirmPassword')
        .exists({ checkFalsy: true })
        .custom((value, { req }) => value === req.body.password)
        .trim()
];
