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

export async function postAddBrewery(req, res, next) {
    let businessForm = req.body;
    businessForm = {
        ...businessForm,
        primaryContact: {
            firstName: businessForm.firstName,
            lastName: businessForm.lastName,
            email: businessForm.userEmail,
            phoneNumber: businessForm.userPhoneNumber
        }
    };
    let errors = [];
    const logo = req.file;
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        try {
            const countries = await Country.find().sort('name');
            const states = await State.find({
                country: businessForm.country
            }).sort('name');
            return res.status(422).render('businesses/business-edit', {
                pageTitle: 'Add Business',
                path: '/business/add-business',
                editing: false,
                hasError: true,
                countries: countries,
                states: states,
                business: businessForm,
                validationErrors: errors.array()
            });
        } catch (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }
    }
    const apiKey = genAPIKey();
    const business = new Business({
        name: businessForm.name,
        phoneNumber: businessForm.phoneNumber,
        genericEmail: businessForm.genericEmail,
        address1: businessForm.address1,
        address2: businessForm.address2,
        suburb: businessForm.suburb,
        postcode: businessForm.postcode,
        state: mongoose.Types.ObjectId.createFromHexString(businessForm.state),
        country: mongoose.Types.ObjectId.createFromHexString(
            businessForm.country
        ),
        abn: businessForm.abn,
        acn: businessForm.acn,
        apiKey: (await apiKey).hashedToken
    });
    try {
        const newBusiness = await business.save();
        const password = generatePassword();
        const hashedPassword = await bcrypt.hash(password, 12);
        const primaryContact = new BusinessUser({
            firstName: businessForm.primaryContact.firstName,
            lastName: businessForm.primaryContact.lastName,
            phoneNumber: businessForm.primaryContact.phoneNumber,
            email: businessForm.primaryContact.email,
            password: hashedPassword,
            business: {
                business: newBusiness,
                access: 'Admin'
            }
        });
        const newPrimaryContact = await primaryContact.save();
        const primaryContactObject = {
            user: newPrimaryContact._id,
            access: 'Admin'
        };
        newBusiness.primaryContact = newPrimaryContact;
        newBusiness.users.push(primaryContactObject);
        await newBusiness.save();
        res.redirect('/businesses/business/' + newBusiness.slug);
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}
