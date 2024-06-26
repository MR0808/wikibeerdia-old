import crypto from 'crypto';

import * as OTPAuth from 'otpauth';
import hiBase from 'hi-base32';
import bcrypt from 'bcryptjs';

import User from '../models/user.js';
import user from '../models/user.js';

const { encode } = hiBase;

const generateRandomBase32 = () => {
    const buffer = crypto.randomBytes(15);
    const base32 = encode(buffer).replace(/=/g, '').substring(0, 24);
    return base32;
};

export async function postGenerateOtp(req, res, next) {
    try {
        const user = await User.findById(req.session.user);
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'No user with that email exists'
            });
        }
        const base32_secret = generateRandomBase32();
        let totp = new OTPAuth.TOTP({
            issuer: 'wikibeerdia.com',
            label: 'Wikibeerdia',
            algorithm: 'SHA1',
            digits: 6,
            secret: base32_secret
        });
        let otpauth_url = totp.toString();
        user.otp_auth_url = otpauth_url;
        user.otp_base32 = base32_secret;
        user.otp_enabled = false;
        user.otp_verified = false;
        req.session.user = await user.save();
        const data = {
            result: 'success',
            base32: base32_secret,
            otpauth_url: otpauth_url
        };
        return res.status(200).json({ data: data });
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

export async function postVerifyOtp(req, res, next) {
    try {
        const { token } = req.body;
        const user = await User.findById(req.session.user);
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'No user with that email exists'
            });
        }
        let totp = new OTPAuth.TOTP({
            issuer: 'wikibeerdia.com',
            label: 'Wikibeerdia',
            algorithm: 'SHA1',
            digits: 6,
            secret: user.otp_base32
        });

        let delta = totp.validate({ token });
        let data;

        if (delta === null) {
            data = { result: 'error' };
            return res.status(200).json({ data: data });
        }
        const recoveryCodes = [];
        const recoveryCodesHashed = [];
        for (let i = 0; i < 6; i++) {
            const recoveryCode = generateRandomString(6);
            let chars = [...recoveryCode];
            chars.splice(3, 0, '-');
            const hashedCode = await bcrypt.hash(recoveryCode, 12);
            recoveryCodes.push(chars.join(''));
            recoveryCodesHashed.push({ backup_code: hashedCode });
        }
        user.otp_backups = recoveryCodesHashed;
        user.otp_enabled = true;
        user.otp_verified = true;
        req.session.user = await user.save();
        data = { result: 'success', recoveryCodes: recoveryCodes };
        return res.status(200).json({ data: data });
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

export async function postValidateOtp(req, res, next) {
    try {
        const { token } = req.body;
        const user = await User.findById(req.session.user);
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'No user with that email exists'
            });
        }

        const message = "Token is invalid or user doesn't exist";
        if (!user) {
            return res.status(401).json({
                status: 'fail',
                message
            });
        }
        let totp = new OTPAuth.TOTP({
            issuer: 'codevoweb.com',
            label: 'CodevoWeb',
            algorithm: 'SHA1',
            digits: 6,
            secret: user.otp_base32
        });

        let delta = totp.validate({ token, window: 2 });

        let data;

        if (delta === null) {
            data = { result: 'error' };
            return res.status(200).json({ data: data });
        }

        data = { result: 'success' };
        return res.status(200).json({ data: data });
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

export async function postDisableOtp(req, res, next) {
    try {
        const user = await User.findById(req.session.user);
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'No user with that email exists'
            });
        }

        user.otp_enabled = false;

        req.session.user = await user.save();
        data = { result: 'success' };
        return res.status(200).json({ data: data });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}
