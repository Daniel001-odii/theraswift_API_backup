import pharmacyRequestModel from '../../admin/models/pharmacyRequests.model';
// import AdminModel from '../models/admin_reg.model';
import UserModel from '../../user/models/userReg.model';
import DoctotModel from '../../doctor/modal/doctor_reg.modal';
import { Request, Response } from 'express'
import { request } from 'http';


// create a pharmacy requet...
export const sendPharmacyRequest = async (req:any, res:Response) => {
    try{
        const { request_type, description, medication } = req.body;
        const user_id = req.params.user_id;
        const doctor_id = req.params.doctor_id;

        if(!user_id){
            return res.status(400).json({ message: "please provide a user ID in req params"})
        }
        if(!doctor_id){
            return res.status(400).json({ message: "please provide a doctor ID in req params"})
        }

        const user = await UserModel.findById(user_id);
        if(!user){
            return res.status(404).json({ message: "invalid user ID provided"})
        }

        const doctor = await DoctotModel.findById(doctor_id);
        if(!doctor){
            return res.status(404).json({ message: "invalid doctor Id provided"});
        };

        const pharmacy_request = new pharmacyRequestModel({
            time: Date.now(),
            sender: req.admin.id,
            request_type,
            description,
            medication,
            user: user_id,
            doctor: doctor_id
        });

        await pharmacy_request.save();
        res.status(201).json({ message: `request for the medication: ${medication} sent successfully!`})

    }catch(error){
        console.log("error sending doctor request: ", error);
        res.status(500).json({ message: "internal server error"});
    }
}


// get all sent pharm requests for a logged i pharmacy/admin
export const getAllSentRequest = async (req:any, res:Response) => {
    try{
        const pharmacy_requests = await pharmacyRequestModel.find({ sender:req.admin.id });

        res.status(200).json({ pharmacy_requests });
    }catch(error){
        res.status(500).json({ message: "internal server error"});
    }
};


// get all requests for a doctor...
export const getPharmacyRequestsForDoctor = async (req: any, res: Response) => {
    try{
        const doctor = req.doctor._id;
        // console.log("requesting doctor: ", req.doctor)
        // if(!doctor){
        //     return res.status(400).json({ message: "please provide a doctor ID in requests params"})
        // }
        const pharmacy_requests = await pharmacyRequestModel.find({ doctor });

        res.status(200).json({ pharmacy_requests });
    }catch(error){
        res.status(500).json({ message: "internal server error"});
    }
}

export const replyPharmacyRequestById = async (req: any, res: Response) => {
    try{
        const request_id = req.params.request_id;
        const { user, text } = req.body;
        if(!request_id){
            return res.status(400).json({ message: "please provide a valid pharmacy request id in url params"})
        }

        const pharm_request = await pharmacyRequestModel.findById(request_id);
        if(!pharm_request){
            return res.status(404).json({ message: "pharmacy request not found"})
        }

        if(!user){
            return res.status(400).json({ message: "please provide user arguments for reply"})
        }
        if(!text){
            return res.status(400).json({ message: "please provide text argument for rpely"})
        }

        // const time = Date.now();

        pharm_request.replies.push({
            user,
            text,
            time: new Date(),
        });
        await pharm_request.save();

        if(pharm_request.replies.length <= 1){
           return res.status(201).json({ message: "reply sent successfully"})
        } else {
            return res.status(200).json({ message: "new reply added to reply thread successfully"})
        }

    }catch(error){
        console.log("error addig reply: ", error);
        res.status(500).json({ message: "internal server error"});
    }
}