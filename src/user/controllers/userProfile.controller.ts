import userModel from '../models/userReg.model';
import { validationResult } from "express-validator";
import { Request, Response } from "express";

export const editUserprofile = async(req:any, res:Response) => {
    try{
         // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // const user = req.user;
        const userId = req.user.id;
        const user:any = await userModel.findById(userId);

        const { firstName, lastName, dateOfBirth, mobileNumber, gender, operatingLocation, address} = req.body;

        // update firstname...
        if(firstName){
            user.firstName = firstName;
        }
        if(lastName){
            user.lastName = lastName
        }
        if(dateOfBirth){
            user.dateOfBirth = dateOfBirth
        }
        if(mobileNumber){
            user.mobileNumber = mobileNumber
        }
        if(gender){
            user.gender = gender;
        }
        if(operatingLocation){
            user.operatingLocation = operatingLocation
        }
        if(address){
            user.address = address
        }

        await user.save();
    
        res.status(200).json({ message: "user profile updated successfully"})


    }catch(error: any){
        res.status(500).json({ message: error.message });
    }
}