import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { MailService } from '@sendgrid/mail';

import User from '../models/user.js';
import Token from '../models/token.js';

export async function getAccount(req, res, next) {
    res.render('account/account-main', {
        pageTitle: 'Account Settings',
        path: '/account',
        blackHeading: true,
        user: req.session.user
    });
}

export async function getPersonalInfo(req, res, next) {
    res.render('account/personal-info', {
        pageTitle: 'Personal Info',
        path: '/account/personal-info',
        blackHeading: true,
        user: req.session.user,
        validationErrors: []
    });
}
