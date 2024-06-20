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

export async function postPersonalInfo(req, res, next) {
    let userForm = req.body;
    let errorsOld = [];
    let profileUrl = '';
    const profilePicture = req.files.profilePicture;
    if (!profilePicture) {
        profileUrl = '';
    } else {
        profileUrl = profilePicture[0].path.replaceAll('\\', '/');
    }
    errorsOld = validationResult(req);
    if (!errorsOld.isEmpty() || profileError) {
        let errors = errorsOld.array();
        try {
            if (profilePicture) {
                deleteFile(profileUrl);
            }
            const countries = await Country.find().sort('name').select('name');
            let states = '';
            if (userForm.country) {
                states = await State.find({ country: userForm.country })
                    .sort('name')
                    .select('name');
            }
            return res.status(422).render('account/personal-info', {
                pageTitle: 'Personal Info',
                path: '/account/personal-info',
                blackHeading: true,
                user: userForm,
                validationErrors: [],
                editing: false,
                hasError: false,
                countries: countries,
                states: states,
                validationErrors: errors
            });
        } catch (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }
    }
    try {
        const user = await User.findById(req.session.user);
        if (profilePicture) {
            deleteFile(user.profilePicture);
            product.imageUrl = profileUrl;
        }
        user.firstName = userForm.firstName;
        user.lastName = userForm.lastName;
        user.gender = userForm.gender;
        user.dateOfBirth = userForm.dateOfBirth;
        user.country = mongoose.Types.ObjectId.createFromHexString(
            userForm.country
        );
        user.state = mongoose.Types.ObjectId.createFromHexString(
            userForm.state
        );
        await user.save();
        res.redirect('/');
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}
