import crypto from 'crypto';
import { error } from 'console';

import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

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
    const mappedErrors = validationResult(req)
        .formatWith((e) => e.msg)
        .mapped();
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email
            },
            validationErrors: errors.array()
        });
    }
    bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            });
            return user.save();
        })
        .then((result) => {
            res.redirect('/login');
            return transporter.sendMail({
                to: email,
                from: 'kram@grebnesor.com',
                subject: 'Signup succeeded!',
                html: '<h1>You successfully signed up!</h1>'
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

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
