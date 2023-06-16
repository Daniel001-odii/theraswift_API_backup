import { body } from 'express-validator';


export const validateLoginParams = [
  // body('email').isEmail(),
  body('password').notEmpty(),
];