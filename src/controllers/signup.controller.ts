import { body, validationResult } from 'express-validator';
import { ExpressArgs } from "../types/generalTypes";
import UserModel from '../models/User.model'
import bcrypt from 'bcrypt'

// signup logic
const signup = async ({ req, res, next }: ExpressArgs) => {
  try {

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

 // Save user to MongoDB
 const user = new UserModel({
  email: req.body.email,
  firstName: req.body.firstName,
  dateOfBirth: req.body.dateOfBirth,
  lastName: req.body.lastName,
  password: hashedPassword,
  mobileNumber: req.body.mobileNumber,
  gender: req.body.gender,
});
await user.save();

res.json({ message: 'Signup successful' });

  } catch (err) {
    // signup error
    next?.(err);
  }
};

export default signup;
