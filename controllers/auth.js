import crypto from 'crypto';

import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { MailService } from '@sendgrid/mail';

import User from '../models/user.js';
import Token from '../models/token.js';

// export const getLogin = (req, res, next) => {
//     let message = req.flash('error');
//     if (message.length > 0) {
//         message = message[0];
//     } else {
//         message = null;
//     }
//     res.render('auth/login', {
//         path: '/login',
//         pageTitle: 'Login',
//         errorMessage: message,
//         oldInput: {
//             email: '',
//             password: ''
//         },
//         validationErrors: []
//     });
// };

// export async function postLogin(req, res, next) {
//     const email = req.body.email;
//     const password = req.body.password;
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(422).render('auth/login', {
//             path: '/login',
//             pageTitle: 'Login',
//             errorMessage: errors.array()[0].msg,
//             oldInput: {
//                 email: email,
//                 password: password
//             },
//             validationErrors: errors.array()
//         });
//     }
//     try {
//         const user = await AdminUser.findOne({ email: email });
//         if (!user) {
//             return res.status(422).render('auth/login', {
//                 path: '/login',
//                 pageTitle: 'Login',
//                 errorMessage: 'Invalid email or password.',
//                 oldInput: {
//                     email: email,
//                     password: password
//                 },
//                 validationErrors: []
//             });
//         }
//         const doMatch = await bcrypt.compare(password, user.password);
//         if (doMatch) {
//             if (req.body.remember) {
//                 const hour = 3600000;
//                 req.session.cookie.maxAge = 14 * 24 * hour; //2 weeks
//             } else {
//                 req.session.cookie.expires = false;
//             }
//             req.session.isLoggedIn = true;
//             req.session.user = user;
//             return req.session.save((err) => {
//                 res.redirect('/');
//             });
//         } else {
//             return res.status(422).render('auth/login', {
//                 path: '/login',
//                 pageTitle: 'Login',
//                 errorMessage: 'Invalid email or password.',
//                 oldInput: {
//                     email: email,
//                     password: password
//                 },
//                 validationErrors: []
//             });
//         }
//     } catch (err) {
//         const error = new Error(err);
//         error.httpStatusCode = 500;
//         return next(error);
//     }
// }

export const getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: '',
        oldInput: {
            firstName: '',
            lastName: '',
            email: ''
        },
        validationErrors: []
    });
};

export async function postSignup(req, res, next) {
    const body = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (body.email === '@') body.email = '';
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            oldInput: {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email
            },
            validationErrors: errors.array()
        });
    }
    try {
        const hashedPassword = await bcrypt.hash(body.password, 12);
        const user = new User({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: hashedPassword
        });
        const newUser = await user.save();
        const token = new Token({
            _userId: newUser._id,
            token: crypto.randomBytes(16).toString('hex')
        });
        await token.save();
        const mail = new MailService();
        mail.setApiKey(process.env.SENDGRID_KEY);
        const message = {
            to: body.email,
            subject: 'Verify your email',
            from: {
                name: 'Mark @ Wikibeerdia',
                email: 'mark@wikibeerdia.com'
            },
            html: `Hello,<br>Please verify your account by clicking the link: <a href="http://${req.headers.host}/confirmation/${token.token}">http://${req.headers.host}/confirmation/${token.token}</a>`
        };
        await mail.send(message);
        res.redirect('/finished');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

export async function getFinished(req, res, next) {
    res.render('auth/finished', {
        path: '/confirmation',
        pageTitle: 'Check your email'
    });
}

export async function getConfirmation(req, res, next) {
    const token = await Token.findOne({ token: req.params.token });
    if (!token) {
        return res.status(400).render('auth/confirmation', {
            path: '/confirmation',
            pageTitle: 'Email Verification',
            error: true,
            message:
                'We were unable to find a valid token. your token may have expired'
        });
    }
    const user = await User.findOne({ _id: token._userId });
}

export async function postResendToken(req, res, next) {}

export const postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
};

// exports.getReset = (req, res, next) => {
//     let message = req.flash('error');
//     if (message.length > 0) {
//         message = message[0];
//     } else {
//         message = null;
//     }
//     res.render('auth/reset', {
//         path: '/reset',
//         pageTitle: 'Reset Password',
//         errorMessage: message
//     });
// };

// exports.postReset = (req, res, next) => {
//     crypto.randomBytes(32, (err, buffer) => {
//         if (err) {
//             console.log(err);
//             return res.redirect('/reset');
//         }
//         const token = buffer.toString('hex');
//         User.findOne({ email: req.body.email })
//             .then((user) => {
//                 if (!user) {
//                     req.flash('error', 'No account with that email found.');
//                     return res.redirect('/reset');
//                 }
//                 user.resetToken = token;
//                 user.resetTokenExpiration = Date.now() + 3600000;
//                 return user.save();
//             })
//             .then((result) => {
//                 res.redirect('/');
//                 return transporter.sendMail({
//                     to: req.body.email,
//                     from: 'kram@grebnesor.com',
//                     subject: 'Password reset',
//                     html: `
//                         <p>You requested a password reset<p>
//                         <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
//                     `
//                 });
//             })
//             .catch((err) => {
//                 const error = new Error(err);
//                 error.httpStatusCode = 500;
//                 return next(error);
//             });
//     });
// };

// exports.getNewPassword = (req, res, next) => {
//     const token = req.params.token;
//     User.findOne({
//         resetToken: token,
//         resetTokenExpiration: { $gt: Date.now() }
//     })
//         .then((user) => {
//             let message = req.flash('error');
//             if (message.length > 0) {
//                 message = message[0];
//             } else {
//                 message = null;
//             }
//             res.render('auth/new-password', {
//                 path: '/new-password',
//                 pageTitle: 'New Password',
//                 errorMessage: message,
//                 userId: user._id.toString(),
//                 passwordToken: token
//             });
//         })
//         .catch((err) => {
//             const error = new Error(err);
//             error.httpStatusCode = 500;
//             return next(error);
//         });
// };

// exports.postNewPassword = (req, res, next) => {
//     const newPassword = req.body.password;
//     const userId = req.body.userId;
//     const token = req.body.passwordToken;
//     let resetUser;
//     User.findOne({
//         resetToken: token,
//         resetTokenExpiration: { $gt: Date.now() },
//         _id: userId
//     })
//         .then((user) => {
//             resetUser = user;
//             return bcrypt.hash(newPassword, 12);
//         })
//         .then((hashedPassword) => {
//             resetUser.password = hashedPassword;
//             resetUser.resetToken = undefined;
//             resetUser.resetTokenExpiration = undefined;
//             return resetUser.save();
//         })
//         .then((result) => {
//             res.redirect('/login');
//         })
//         .catch((err) => {
//             const error = new Error(err);
//             error.httpStatusCode = 500;
//             return next(error);
//         });
// };
