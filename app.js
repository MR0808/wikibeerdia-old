import path from 'path';
import * as url from 'url';

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import helmet from 'helmet';
// import { csrfSync } from 'csrf-sync';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

import * as errorController from './controllers/error.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const MongoDBStore = connectMongoDBSession(session);

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.vuiwnxj.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

// const { csrfSynchronisedProtection } = csrfSync({
//     getTokenFromRequest: (req) => req.body.csrfToken
// });

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(
    helmet.contentSecurityPolicy({
        useDefaults: true,
        directives: {
            'default-src': ["'self'"],
            'script-src': ["'self'", "'unsafe-inline'", "'unsafe-hashes'"],
            'script-src': [
                "'self'",
                "'unsafe-inline'",
                'js.stripe.com',
                'cdn.jsdelivr.net'
            ],
            'style-src': [
                "'self'",
                "'unsafe-inline'",
                'fonts.googleapis.com',
                'kit-pro.fontawesome.com'
            ],
            'frame-src': ["'self'", 'js.stripe.com'],
            'font-src': [
                "'self'",
                'fonts.googleapis.com',
                'fonts.gstatic.com',
                'kit-pro.fontawesome.com'
            ]
        }
    })
);

import mainRoutes from './routes/main.js';
import authRoutes from './routes/auth.js';
import configRoutes from './routes/config.js';
import locationRoutes from './routes/location.js';
import breweryRoutes from './routes/brewery.js';

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        const extension = file.mimetype.slice(6, file.mimetype.length);
        cb(null, uuidv4() + '.' + extension);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
    session({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

// app.use(csrfSynchronisedProtection);

app.use((req, res, next) => {
    // ['log', 'warn'].forEach(function (method) {
    //     var old = console[method];
    //     console[method] = function () {
    //         var stack = new Error().stack.split(/\n/);
    //         // Chrome includes a single "Error" line, FF doesn't.
    //         if (stack[0].indexOf('Error') === 0) {
    //             stack = stack.slice(1);
    //         }
    //         var args = [].slice.apply(arguments).concat([stack[1].trim()]);
    //         return old.apply(console, args);
    //     };
    // });
    res.locals.isAuthenticated = req.session.isLoggedIn;
    // res.locals.csrfToken = req.csrfToken(true);
    res.locals.csrfToken = true;
    next();
});

app.use(mainRoutes);
app.use(authRoutes);
app.use('/config', configRoutes);
app.use('/location', locationRoutes);
app.use('/breweries', breweryRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).render('500');
});

try {
    await mongoose.connect(MONGODB_URI);
    app.listen(process.env.PORT || 3000);
} catch (err) {
    console.log(err);
}
