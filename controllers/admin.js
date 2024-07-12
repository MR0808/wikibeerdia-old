import { validationResult } from 'express-validator';
import { MailService } from '@sendgrid/mail';
import mongoose from 'mongoose';
import { DateTime } from 'luxon';
import bcrypt from 'bcryptjs';

import User from '../models/user.js';
import BreweryTypes from '../models/breweryType.js';
import Token from '../models/token.js';
import Country from '../models/country.js';
import State from '../models/state.js';
import deleteFile from '../util/file.js';
import slugify from '../middleware/slugify.js';

export const getIndex = (req, res, next) => {
    res.render('admin/index', {
        path: '/admin/',
        pageTitle: 'Admin Dashboard',
        validationErrors: [],
        user: req.session.user
    });
};

export const getLogin = (req, res, next) => {
    if (req.session.isLoggedIn && req.session.user.access === 'Admin') {
        return res.redirect('/admin/');
    }
    req.session.destroy((err) => {
        console.log(err);
    });
    res.render('admin/login', {
        path: '/login',
        pageTitle: 'Login',
        loginError: false,
        oldInput: {
            email: '',
            remember: true
        },
        validationErrors: []
    });
};

export async function postLogin(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const remember = req.body.remember;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/login', {
            path: '/login',
            pageTitle: 'Login',
            loginError: false,
            oldInput: {
                email: email,
                remember: remember
            },
            validationErrors: errors.array()
        });
    }
    try {
        const user = await User.findOne({
            $or: [{ email: email }, { username: email }],
            access: 'Admin'
        });
        if (!user) {
            return res.status(422).render('admin/login', {
                path: '/login',
                pageTitle: 'Login',
                loginError: true,
                oldInput: {
                    email: email,
                    remember: remember
                },
                validationErrors: [
                    {
                        path: 'email',
                        msg: 'User/Email and password combination not found.'
                    }
                ]
            });
        }
        const doMatch = await bcrypt.compare(password, user.password);
        if (!doMatch) {
            return res.status(422).render('admin/login', {
                path: '/login',
                pageTitle: 'Login',
                loginError: true,
                oldInput: {
                    email: email,
                    remember: remember
                },
                validationErrors: []
            });
        } else {
            if (remember) {
                const hour = 3600000;
                req.session.cookie.maxAge = 14 * 24 * hour; //2 weeks
            } else {
                req.session.cookie.expires = false;
            }
            req.session.user = user;
            await req.session.save();
            if (user.otp_enabled) {
                res.redirect('/admin/otp');
            } else {
                req.session.isLoggedIn = true;
                await req.session.save();
                res.redirect('/admin');
            }
        }
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

export const getOtpValidation = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/admin');
    }
    res.render('admin/otp', {
        path: '/otp',
        pageTitle: 'Two-Factor Authentication',
        validationErrors: [],
        otpError: false
    });
};

export async function getUserList(req, res, next) {
    const users = await User.find().sort('lastName');
    res.render('admin/users-list', {
        path: '/admin/users/list',
        pageTitle: 'User list',
        validationErrors: [],
        user: req.session.user,
        users: users
    });
}

export async function getBreweryTypes(req, res, next) {
    const types = await BreweryTypes.find().sort('name');
    res.render('admin/brewery-types', {
        path: '/admin/brewery-types',
        pageTitle: 'Brewery Types',
        validationErrors: [],
        user: req.session.user,
        types: types
    });
}

export async function postBreweryTypes(req, res, next) {
    let errors = [];
    let data;
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        data = { result: 'error', errors: errors.array() };
        return res.status(200).json({ data: data });
    }
    const newType = req.body.type;
    const id = req.body.id;
    const method = req.body.method;
    let type;
    try {
        if (method === 'edit') {
            type = await BreweryTypes.findById(id);
        } else {
            type = new BreweryTypes();
        }
        type.name = newType;
        type.slug = slugify(newType);
        await type.save();
        data = { result: 'success' };
        return res.status(200).json({ data: data });
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}
