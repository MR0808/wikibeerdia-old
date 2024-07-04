import { body } from 'express-validator';

export const email = [body('email').normalizeEmail()];
