/* 
firstname
lastname
phoneNumber
title
organization
*/

import DoctotModel from "../modal/doctor_reg.modal";
import {Request, Response } from "express"



export const editDoctorProfile = async(req:any, res:Response)=> {
    try{
        const doctor_id = req.doctor._id;
        const doctor:any = await DoctotModel.findById(doctor_id);
        console.log("doc ID: ", doctor_id, " doctor: ", doctor)
        const { firstName, lastName, phoneNumber, title, organization, addresss } = req.body;

        if(firstName){
            doctor.firstName = firstName
        }
        if(lastName){
            doctor.lastName = lastName
        }
        if(phoneNumber){
            doctor.phoneNumber = phoneNumber
        }
        if(title){
            doctor.title = title
        }
        if(organization){
            doctor.organization = organization
        }

        if(addresss){
            doctor.addresss = addresss
        }
        await doctor.save();
        res.status(200).json({ message: "profile updated successfully!"})
    }catch(error:any){
        console.log("error editing doctor profile: ", error.errors);
        res.status(500).json({ message: "couldnt update profile", error: error.errors})
    }
}