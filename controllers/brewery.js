import { validationResult } from 'express-validator';

import Brewery from '../models/brewery.js';
import titleCase from '../util/titlecase.js';
import Country from '../models/country.js';
import State from '../models/state.js';
import City from '../models/city.js';
import BreweryType from '../models/breweryType.js';

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
            oldInput: {
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
