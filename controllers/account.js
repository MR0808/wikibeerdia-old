import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { MailService } from '@sendgrid/mail';

import User from '../models/user.js';
import Token from '../models/token.js';
import Country from '../models/country.js';
import State from '../models/state.js';

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
        const countries = await Country.find().sort('name').select('name');
        const defaultCountry = await Country.findOne({ name: 'Australia' });
        const states = await State.find({ country: defaultCountry._id })
            .sort('name')
            .select('name');
        res.render('account/personal-info', {
            pageTitle: 'Personal Info',
            path: '/account/personal-info',
            blackHeading: true,
            user: req.session.user,
            validationErrors: [],
            editing: false,
            hasError: false,
            countries: countries,
            states: states,
            user: {
                country: defaultCountry._id.toString(),
                profilePicture: ''
            }
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
    let profileError = false;
    if (!logo) {
        logoError = true;
    } else {
        logoUrl = logo[0].path.replaceAll('\\', '/');
    }
    if (breweryImages) {
        for (let image of breweryImages) {
            breweryImagesUrl.push({
                imageUrl: image.path.replaceAll('\\', '/')
            });
        }
    }
    errorsOld = validationResult(req);
    if (!errorsOld.isEmpty()) {
        let errors = errorsOld.array();
        if (logoError) {
            errors.push({
                type: 'field',
                value: '',
                msg: 'Please add a valid logo (JPG or PNG)',
                path: 'logo',
                location: 'body'
            });
        }
        try {
            const types = await BreweryType.find().sort('name');
            if (logo) {
                deleteFile(logoUrl);
            }
            if (breweryImages) {
                for (let image of breweryImages) {
                    deleteFile(image.path);
                }
            }
            return res.status(422).render('breweries/brewery-edit', {
                pageTitle: 'Add Brewery',
                path: '/breweries/add-brewery',
                editing: false,
                hasError: true,
                types: types,
                brewery: breweryForm,
                validationErrors: errors
            });
        } catch (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }
    }
    const brewery = new Brewery({
        name: breweryForm.name,
        city: breweryForm.city,
        description: breweryForm.description,
        website: breweryForm.website,
        logoUrl: logoUrl,
        images: breweryImagesUrl,
        type: mongoose.Types.ObjectId.createFromHexString(breweryForm.type),
        user: req.session.user
    });
    try {
        const newBrewery = await brewery.save();
        res.redirect('/');
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}
