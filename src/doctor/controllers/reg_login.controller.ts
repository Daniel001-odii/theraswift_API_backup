import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import DoctotModel from "../modal/doctor_reg.modal";
import PatientModel from "../modal/patient_reg.model";
import DoctorWalletModel from "../modal/doctorWallet.model";
import { modifiedPhoneNumber } from "../../utils/mobilNumberFormatter";

import { updateCompletedAccountSteps } from "../../utils/checkCompletedAccountSteps";

import { initializeFormidable } from "../../config/formidable.config";
import { uploadHMOImages } from "../../utils/firebase.upload.utility";

//doctor signup /////////////
export const doctorSignUpController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

  try {
    const {
      email,
      phoneNumber,
      firstName,
      lastName,
      password,
      title,
      organization,
      clinicCode,
      addresss,
      speciality,
      regNumber,
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // format mobile number to international format
    let phonenumber = modifiedPhoneNumber(phoneNumber);
    
    // try find user with the same email
    const doctorEmailExists = await DoctotModel.findOne({ email });
    const doctorNumberExists = await DoctotModel.findOne({ phoneNumber: phonenumber });

    // check if doctor exists
    if (doctorEmailExists || doctorNumberExists) {
      return res
        .status(401)
        .json({ message: "Email or Mobile Number exists already" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); 

    let doctorClinicCode = clinicCode;
    let superDoctor = false
    let clinicVerification = {
      isVerified: false,
    };
    clinicVerification.isVerified = true
    
    if (!clinicCode || clinicCode == '' ) {
      doctorClinicCode = ''
      superDoctor = true
      clinicVerification.isVerified = false

    } else{
      const checkClinicCode = await DoctotModel.findOne({clinicCode: clinicCode, superDoctor: true});

      if (!checkClinicCode) {
        return res
        .status(401)
        .json({ message: "incorrect clinic code" });
      }
    }

    // Save user to MongoDB
    const doctor = new DoctotModel({
      email,
      firstName,
      lastName,
      phoneNumber: phonenumber,
      password: hashedPassword,
      title,
      organization,
      clinicCode: doctorClinicCode,
      clinicVerification,
      superDoctor,
      addresss,
      speciality,
      regNumber
    });
    let doctorSaved = await doctor.save();

    if (superDoctor) {
      //create doctor wallet Account
      const doctorWallet = new DoctorWalletModel({
        amount: 0,
        doctorId: doctorSaved._id
      })

      await doctorWallet.save();
      
    }


    res.json({
      message: "Signup successful",
      doctor: {
        _id: doctorSaved._id,
        firstName: doctorSaved.firstName,
        lastName: doctorSaved.lastName,
        email: doctorSaved.email,
        organization: doctorSaved.organization,
        title: doctorSaved.title,
        address: doctorSaved.addresss,
        speciality: doctorSaved.speciality,
        regNumber: doctorSaved.regNumber
      }
    });
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//doctor signIn with email/////////////
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

    if (!doctor.emailOtp.verified) {
      return res.status(401).json({ message: "email not verified." });
    }

    if (doctor.clinicCode == '') {
      return res.status(401).json({ message: "you don't have clinic code." });
    }

    if (!doctor.clinicVerification.isVerified) {
      return res.status(401).json({ message: "clinic code not yet verified." });
    }

    // generate access token
    const accessToken = jwt.sign(
      { 
        _id: doctor?._id,
        email: doctor.email,
        clinicCode: doctor.clinicCode
      },
      process.env.JWT_SECRET_KEY!,
      // { expiresIn: "24h" }
    );

    // return access token
    res.json({
      message: "Login successful",
      doctor,
      Token: accessToken
    });

    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//doctor signin  with mobile number/////////////
export const doctorMobileNumberSignInController = async (
  req: Request,
  res: Response,
) => {

  try {
    const {
      mobileNumber,
      password,
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // format mobile number to international format
    let phonenumber = modifiedPhoneNumber(mobileNumber);

    // try find user with the same email
    const doctor = await DoctotModel.findOne({ phoneNumber: phonenumber});

    // check if user exists
    if (!doctor) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    // compare password with hashed password in database
    const isPasswordMatch = await bcrypt.compare(password, doctor.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "incorrect credential." });
    }

    if (!doctor.phoneNumberOtp.verified) {
      return res.status(401).json({ message: "mobile number not verified." });
    }

    if (doctor.clinicCode == '') {
      return res.status(401).json({ message: "you don't have clinic code." });
    }

    if (!doctor.clinicVerification.isVerified) {
      return res.status(401).json({ message: "clinic code not yet verified." });
    }

    // generate access token
    const accessToken = jwt.sign(
      { 
        _id: doctor?._id,
        email: doctor.email,
        clinicCode: doctor.clinicCode
      },
      process.env.JWT_SECRET_KEY!,
      // { expiresIn: "24h" }
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
    const {
      email,
      firstName,
      surname,
      phoneNumber,
      gender,
      address,
      dateOFBirth,
      hmo,
      medicalRecord
    } = req.body;

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const doctor = req.doctor;

    let patientHmo ={}

    if(hmo.upload && hmo.upload.front && hmo.upload.back){
      patientHmo = {
        upload: hmo.upload,
        wasUploaded: true
      }
    }
    else if(hmo.inputtedDetails){
      patientHmo = {
        inputtedDetails: hmo.inputtedDetails
      }
    }

    let formattedPhoneNumber = modifiedPhoneNumber(phoneNumber)

    let medicationImg = medicalRecord || null;

    const patient = new PatientModel({
      email,
      firstName, 
      surname,
      phoneNumber: formattedPhoneNumber,
      gender,
      address,
      dateOFBirth,
      medicalRecord: medicationImg,
      doctorId: doctor._id,
      hmo: patientHmo,
      clinicCode: doctor.clinicCode
    })

    let patientSaved = await patient.save()


    // save to doctors completedAccountsteps...
    doctor.completedAccountsteps.step3.addedPatients = true;
    await doctor.save();


    return res.status(200).json({
      patient: {
        id: patientSaved._id,
        email: patientSaved.email,
        firstName: patientSaved.firstName,
        surname: patientSaved.surname,
        phoneNumber: patientSaved.phoneNumber,
        gender: patientSaved.gender,
        address: patientSaved.address,
        dateOFBirth: patientSaved.dateOFBirth,
        doctorId: patientSaved.doctorId,
        medicalRecord: medicationImg,
        hmo: patientSaved.hmo,
        clinicCode: patientSaved.clinicCode
      }
    })

  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}


// upload HMO image and return upload URL...
export const uploadHMOImagesToFirebase = async(req: any, res: Response) => {
  try {
    const form = initializeFormidable();
    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        return res.status(500).json({ message: "error uploading images", err });
      }
      // Extract the array of files
      const hmoImages = files['HMO_image'];
      if (!hmoImages || hmoImages.length === 0) {
        return res.status(400).json({ message: "No images found" });
      }
      if(hmoImages.length < 2){
        return res.status(400).json({ message: "HMO images must include both front and back"});
      }
      // Array to store uploaded image URLs
      const uploadedImages: string[] = [];
      // Loop through each file and upload it
      for (const file of hmoImages) {
        try {
          const image_url = await uploadHMOImages(file); // Reuse your function for single file uploads
          uploadedImages.push(image_url.url);
        } catch (uploadError) {
          return res.status(500).json({ message: "Error uploading image", error: uploadError });
        }
      }
      // Send back all the uploaded image URLs
      res.status(201).json({ image_urls: uploadedImages });
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering patient", error });
    console.log("Error registering patient: ", error);
  }
};




// Decode Auth Token
export const getDetailsThroughDecodedToken = async (req: any, res: Response, next: NextFunction) => {
  try {

    const doctorEmail = req.doctor.email;

    const doctor = await DoctotModel.findOne({
      email: doctorEmail
    })
    
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" })
    }

    const updatedCompletedAccountSteps = await updateCompletedAccountSteps(String(doctor._id),doctor.clinicCode);

    // get the super doctor...(doctor with thesame clinic code but with superDoctor as true)
    const super_doctor = await DoctotModel.findOne({ clinicCode: doctor.clinicCode, superDoctor: true });

    // Return only necessary details
    res.json({
      doctor: {
        _id: updatedCompletedAccountSteps?._id,
        firstName: updatedCompletedAccountSteps?.firstName,
        lastName: updatedCompletedAccountSteps?.lastName,
        email: updatedCompletedAccountSteps?.email,
        phoneNumber: updatedCompletedAccountSteps?.phoneNumber,
        title: updatedCompletedAccountSteps?.title,
        organization: updatedCompletedAccountSteps?.organization,
        clinicCode: updatedCompletedAccountSteps?.clinicCode,
        speciality: updatedCompletedAccountSteps?.speciality,
        regNumber: updatedCompletedAccountSteps?.regNumber,
        addresss: updatedCompletedAccountSteps?.addresss,
        completedAccountSteps: updatedCompletedAccountSteps?.completedAccountSteps
      },

      superDoctor: super_doctor,
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Server error" })
  }
}
