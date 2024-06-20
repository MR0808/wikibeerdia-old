import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

import Brewery from '../models/brewery.js';
import titleCase from '../util/titlecase.js';
import Country from '../models/country.js';
import State from '../models/state.js';
import City from '../models/city.js';
import BreweryType from '../models/breweryType.js';
import deleteFile from '../util/file.js';

export async function getBrewery(req, res, next) {
    const breweryId = req.params.breweryId;
    try {
        const brewery = await Brewery.findById(breweryId)
            .populate({ path: 'city', select: 'name' })
            .populate({
                path: 'city',
                populate: { path: 'state', select: 'name' }
            })
            .populate({
                path: 'city',
                populate: { path: 'country', select: 'name' }
            });
        res.render('breweries/brewery-view', {
            pageTitle: brewery.name,
            path: '/brewery/brewery',
            brewery: brewery
        });
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

export async function getAddBrewery(req, res, next) {
    try {
        const types = await BreweryType.find().sort('name');
        res.render('breweries/brewery-edit', {
            pageTitle: 'Add Brewery',
            path: '/breweries/add-brewery',
            editing: false,
            hasError: false,
            validationErrors: [],
            types: types,
            brewery: {
                name: '',
                description: '',
                city: '',
                cityName: '',
                website: ''
            }
        });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

export async function postAddBrewery(req, res, next) {
    let breweryForm = req.body;
    let errorsOld = [];
    let logoUrl = '';
    let breweryImagesUrl = [];
    const logo = req.files.logo;
    const breweryImages = req.files.breweryImages;
    let logoError = false;
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
