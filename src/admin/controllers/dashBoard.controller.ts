import { validationResult } from "express-validator";
import { Request, Response } from "express";
import PatientModel from "../../doctor/modal/patient_reg.model";
import DoctorModel from "../../doctor/modal/doctor_reg.modal";
import MedicationModel from "../models/medication.model";
import OrderModel from "../models/order.model";

//dashboard /////////////
export const dashboardController = async (
    req: any,
    res: Response,
) => {
  try {

    const totalPatient = await PatientModel.countDocuments()

    const totalProvider = await DoctorModel.countDocuments()

    const outStock = await MedicationModel.countDocuments({quantity: { $lt: 1 }})

    const result = await OrderModel.aggregate([
        {
            $group: {
                _id: null,          // No grouping criteria, just sum over all documents
                total: { $sum: "$totalAmount" } // Sum the price field
            }
        }
    ]);

    // Extract the total price from the result
    const totalSales = result.length > 0 ? result[0].total : 0;

    
    return res.status(200).json({
        totalPatient,
        totalProvider,
        outStock,
        totalSales
    })
 
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//expired medication /////////////
export const expiredMedicationController = async (
    req: any,
    res: Response,
) => {
  try {

    let {
        page,
        limit
    } = req.query

    page = page || 1; // Page number, default to 1
    limit = limit || 50; // Documents per page, default to 10

    const skip = (page - 1) * limit; // Calculate how many documents to skip= req.body;
    const expiredMedication = await MedicationModel.find({expiredDate: { $lt: new Date() }}).skip(skip).limit(limit);

    const expiredMedicationTotal = await MedicationModel.countDocuments({expiredDate: { $lt: new Date() }});

    
    return res.status(200).json({
        currentPage: page,
        totalPages: Math.ceil(expiredMedicationTotal / limit),
        expiredMedicationTotal,
        expiredMedication
    })
 
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}