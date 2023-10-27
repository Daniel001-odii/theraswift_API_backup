import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import DoctotModel from "../modal/doctor_reg.modal";
import PatientModel from "../modal/patient_reg.model";
import DoctorWalletModel from "../modal/doctorWallet.model";
import { uploadToS3 } from "../../utils/aws3.utility";
import { v4 as uuidv4 } from "uuid";


//doctor signup /////////////

export const doctorSignUpController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

  try {
    const {
      email,
      firstName,
      lastName,
      password,
      title,
      organization,
      clinicCode,
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // try find user with the same email
    const doctorEmailExists = await DoctotModel.findOne({ email });

    // check if doctor exists
    if (doctorEmailExists) {
      return res
        .status(401)
        .json({ message: "Email  exists already" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); 

    let doctorClinicCode = '';
    if (clinicCode != '') {
      doctorClinicCode = clinicCode
    }

    // Save user to MongoDB
    const doctor = new DoctotModel({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      title,
      organization,
      clinicCode: doctorClinicCode
    });
    let doctorSaved = await doctor.save();

    // //create doctor wallet Account
    // const doctorWallet = new DoctorWalletModel({
    //   amount: 0,
    //   doctorId: doctorSaved._id
    // })

    // await doctorWallet.save();


    res.json({
      message: "Signup successful",
      doctor: {
        _id: doctorSaved._id,
        firstName: doctorSaved.firstName,
        lastName: doctorSaved.lastName,
        email: doctorSaved.email,
        organization: doctorSaved.organization,
        title: doctorSaved.title
      }
    });
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//doctor signIn /////////////

export const doctorSignInController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      email,
      password,
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // try find doctor with the same email
    const doctor = await DoctotModel.findOne({ email });

    // check if doctor exists
    if (!doctor) {
      return res
        .status(401)
        .json({ message: "incorrect credential" });
    }

    // compare password with hashed password in database
    const isPasswordMatch = await bcrypt.compare(password, doctor.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "incorrect credential." });
    }

    // generate access token
    const accessToken = jwt.sign(
      { 
        _id: doctor?._id,
        email: doctor.email,
        clinicCode: doctor.clinicCode
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "24h" }
    );

    // return access token
    res.json({
      message: "Login successful",
      Token: accessToken
    });

    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//doctor register patient /////////////
export const doctorRegisterPatient = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  
  try {
     // Access the uploaded file details
    const file = req.file;
    let medicationImg;

    const {
      email,
      firstName,
      surname,
      phoneNumber,
      gender,
      address,
      dateOFBirth,
      hmo,
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!file) {
      medicationImg = '';
    }else{
      const filename = uuidv4();
      const result = await uploadToS3(req.file.buffer, `${filename}.jpg`);
      medicationImg = result?.Location!;
      console.log(result);
      //medicationImg = uploadToS3(file);
    }

    const doctor = req.doctor;
    let patientHmo = '';

    if (hmo != '') {
      patientHmo = hmo;
    }

    // Save patient to MongoDB
    const patient = new PatientModel({
      email,
      firstName,
      surname,
      phoneNumber,
      gender,
      address,
      dateOFBirth,
      medicalRecord: medicationImg,
      doctorId: doctor._id,
      hmo: patientHmo,
    });
    let patientSaved = await patient.save();
    

    return res.status(200).json({
      message: "Login successful",
      patient:{
        id: patientSaved._id,
        email: patientSaved.email,
        firstName: patient.firstName,
        surname: patientSaved.surname,
        phoneNumber: patientSaved.phoneNumber,
        gender: patientSaved.gender,
        address: patientSaved.address,
        dateOFBirth: patientSaved.dateOFBirth,
        doctorId: patientSaved.doctorId,
        medecalRecord: medicationImg
      }
    })


    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
    
  }
}
