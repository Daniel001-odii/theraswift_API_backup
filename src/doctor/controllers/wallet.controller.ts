import DoctorWalletModel from "../modal/doctorWallet.model";
import { validationResult } from "express-validator";
import { Request, Response } from "express";


// FUND DOCTOR WALLET >>>
export const fundDoctorWallet = async (req:any, res:Response) => {
    try{
        const doctor = req.doctor;
        const { amount } = req.body;
        const wallet:any = await DoctorWalletModel.findById(doctor._id);

        // algorithim to fund doctor wallet here...
        if(!amount){
            return res.status(400).json({ message: "please provide a valid amount"});
        }

        // add amount to doctor's wallet here...
        wallet.amount += amount;
        // add transaction type for history tracking...
        wallet.transactions.push({
            transaction_type: "fund",
            // transsaction_date is prefilled by default
        });

        res.status(201).json({ message: `you added ${amount} into your wallet`});

    }catch(error:any){
        res.status(500).json({ message: error.message })
    }
}


// GET DOCTOR WALLET >>>
export const getDoctorWallet = async (req:any, res:Response) => {
    try{
        const doctor = req.doctor;
        const wallet:any = await DoctorWalletModel.findById(doctor._id);

        if(!wallet){
            const newWallet = new DoctorWalletModel({
                doctorId: doctor._id
            });
            await newWallet.save();

            return res.status(201).json({ message: "new wallet created for doctor", newWallet });
        }

        res.status(200).json({ wallet });

    }catch(error:any){
        res.status(500).json({ message: error.message })  
    }
};


// SET WALLET CLINIC CODE >>>
export const setWalletClinicCode = async (req:any, res:Response) => {
    try{
        const doctor = req.doctor;
        const { clinicCode } = req.body;
        const wallet:any = await DoctorWalletModel.findById(doctor._id);

        if(!clinicCode){
            return res.status(400).json({ message: "please provide a valid clinic code"});
        }
       
        wallet.clinicCode = clinicCode;
        await wallet.save();

        res.status(200).json({ message: "wallet clinic code updated successfully" });

    }catch(error:any){
        res.status(500).json({ message: error.message })  
    }
}


