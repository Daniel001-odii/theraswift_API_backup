import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

//admin signin /////////////
export const userSignUpController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

}