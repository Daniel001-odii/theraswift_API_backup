import { Schema, model } from "mongoose";
import { IUser } from "../interface/generalInterface";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = model<IUser>("User", UserSchema);

export default UserModel;



// import express from 'express';
// import { body, validationResult } from 'express-validator';
// import bcrypt from 'bcrypt';
// import User from './models/User';

// const app = express();

// // Body parameter validation middleware
// const validateBodyParams = [
//   body('email').isEmail(),
//   body('firstName').notEmpty(),
//   body('dateOfBirth').notEmpty(),
//   body('lastName').notEmpty(),
//   body('password').notEmpty(),
//   body('passwordConfirmation').custom((value, { req }) => {
//     if (value !== req.body.password) {
//       throw new Error('Passwords do not match');
//     }
//     return true;
//   }),
//   body('mobileNumber').notEmpty(),
//   body('emailConfirmation').custom((value, { req }) => {
//     if (value !== req.body.email) {
//       throw new Error('Emails do not match');
//     }
//     return true;
//   }),
//   body('gender').isIn(['male', 'female']).withMessage('Gender must be either male or female'),
// ];

// // Signup route
// app.post('/signup', validateBodyParams, async (req, res) => {
//   // Check for validation errors
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   // Hash password
//   const hashedPassword = await bcrypt.hash(req.body.password, 10);

//   // Save user to MongoDB
//   const user = new User({
//     email: req.body.email,
//     firstName: req.body.firstName,
//     dateOfBirth: req.body.dateOfBirth,
//     lastName: req.body.lastName,
//     password: hashedPassword,
//     mobileNumber: req.body.mobileNumber,
//     gender: req.body.gender,
//   });
//   await user.save();

//   res.json({ message: 'Signup successful' });
// });

// app.listen(3000, () => {
//   console.log('Server listening on port 3000');
// });
