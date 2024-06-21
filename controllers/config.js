import { validationResult } from 'express-validator';

import * as style from './style.js';
import BreweryType from '../models/breweryType.js';
import titleCase from '../util/titlecase.js';
import Country from '../models/country.js';
import State from '../models/state.js';

export async function postBreweryType(req, res, next) {
    const breweryType = req.body.breweryType;
    if (!breweryType) {
        // const types = await BreweryType.find().sort('name');
        // return res.status(422).render('config/merchanttype', {
        //     path: 'config/merchanttype',
        //     pageTitle: 'Merchant Types',
        //     errorMessage: 'No merchant type entered',
        //     hasError: true,
        //     validationErrors: [],
        //     query: req.query,
        //     types: types
        // });
        return res.status(422).send('No Brewery');
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // const types = await MerchantType.find().sort('name');
        // return res.status(422).render('config/merchanttype', {
        //     path: 'config/merchanttype',
        //     pageTitle: 'Merchant Types',
        //     errorMessage: errors.array()[0].msg,
        //     hasError: true,
        //     validationErrors: errors.array(),
        //     query: req.query,
        //     types: types
        // });
        return res.status(422).send(errors);
    }
    const type = new BreweryType({
        name: titleCase(breweryType)
    });
    try {
        await type.save();
        // res.redirect('/config/merchanttype?added=true');
        return res.status(200).send('Success');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

export async function postAddStyle(req, res, next) {
    const name = req.body.name;
    const parentId = req.body.parentId;
    const newId = await style.addStyle(name, parentId);
    return res.send(newId);
}

export async function getStyleDescendants(req, res, next) {
    const categoryId = req.body.categoryId;
    const styles = await style.getStyleDescendants(categoryId);
    return res.send(styles);
}

export async function getStates(req, res, next) {
    const states = await State.find({ country: req.body.country });
    return res.status(200).json({ data: states });
}
