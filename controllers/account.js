import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { MailService } from '@sendgrid/mail';
import mongoose from 'mongoose';
import multer from 'multer';

import User from '../models/user.js';
import Token from '../models/token.js';
import Country from '../models/country.js';
import State from '../models/state.js';
import deleteFile from '../util/file.js';

export async function getAccount(req, res, next) {
    res.render('account/account-main', {
        pageTitle: 'Account Settings',
        path: '/account',
        blackHeading: true,
        user: req.session.user
    });
}

export async function getPersonalInfo(req, res, next) {
    try {
        const user = req.session.user;
        const countries = await Country.find().sort('name').select('name');
        let states = '';
        if (!user.country) {
            user.country = '';
        } else {
            states = await State.find({ country: user.country })
                .sort('name')
                .select('name');
        }
        res.render('account/personal-info', {
            pageTitle: 'Personal Info',
            path: '/account/personal-info',
            blackHeading: true,
            user: user,
            validationErrors: [],
            editing: false,
            hasError: false,
            countries: countries,
            states: states
        });
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

export async function postPersonalInfoName(req, res, next) {
    let errors = [];
    let data;
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        data = { result: 'error', errors: errors.array() };
        return res.status(200).json({ data: data });
    }
    data = { result: 'success' };
    return res.status(200).json({ data: data });
}
