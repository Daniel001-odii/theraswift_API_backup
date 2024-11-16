// import MedicationModel from "../../admin/models/medication.model";
import UserMedicationModel from "../../user/models/medication.model";
import UserModel from "../../user/models/userReg.model";
import DoctotModel from "../modal/doctor_reg.modal";
import { Response, Request } from "express";
import PatientModel from "../modal/patient_reg.model";

export const followSuperDoctor = async (req: any, res: Response) => {
  try {
    const practice_doc_id = req.doctor._id;
    const practice_doc = req.doctor;
    const { doctor } = req.body;

    if (!doctor) {
      return res.status(400).json({ message: "Please provide a valid doctor id" });
    }

    // Find the super doctor by ID
    const doctor_model: any = await DoctotModel.findById(doctor);
/* 
    if (!doctor_model || doctor_model.superDoctor !== true) {
      return res.status(400).json({ message: "Sorry, you can only follow a super doctor" });
    } */

    // Find the practice doctor
    const practice_doc_model: any = await DoctotModel.findById(practice_doc_id);

    // Check if the practice doctor is already following the super doctor
    const isFollowing = doctor_model.followers.some((follower: any) => follower._id.toString() === practice_doc_id.toString());

    if (isFollowing) {
      // Unfollow logic: remove the practice doctor from super doctor's followers
      doctor_model.followers = doctor_model.followers.filter((follower: any) => follower._id.toString() !== practice_doc_id.toString());

      // Remove the super doctor from practice doctor's following
      practice_doc_model.following = practice_doc_model.following.filter((follow: any) => follow._id.toString() !== doctor.toString());

      await doctor_model.save();
      await practice_doc_model.save();

      return res.status(200).json({ message: `You have unfollowed ${doctor_model.firstName} ${doctor_model.lastName}` });
    } else {
      // Follow logic: add the practice doctor to super doctor's followers
      doctor_model.followers.push({ _id: practice_doc_id, name: `${practice_doc_model.firstName} ${practice_doc_model.lastName}` });

      // Add the super doctor to practice doctor's following
      practice_doc_model.following.push({ _id: doctor_model._id, name: `${doctor_model.firstName} ${doctor_model.lastName}` });

      await doctor_model.save();
      await practice_doc_model.save();

      return res.status(201).json({ message: `You are now following ${doctor_model.firstName} ${doctor_model.lastName}` });
    }
  } catch (error) {
    res.status(500).json({ message: "Error following/unfollowing doctor", error });
    console.log("Error following/unfollowing doctor:", error);
  }
};


// get lists of doctors.prescribers being followed..
export const getPrescribersFollowingList = async(req:any, res: Response) => {
    try{
        const practice_doc:any = await DoctotModel.findById(req.doctor._id);
        const following =  practice_doc.following;
        res.status(200).json({ following });
    }catch(error){
        res.status(500).json({ message: "error getting list of prescribers being followed"})       
    }
}


export const getDoctorsUnderPractice = async(req:any, res: Response) => {
  try{
    const clinic_code = req.params.clinic_code;

    const doctors = await DoctotModel.find({ 
      clinicCode: clinic_code 
    },
    "firstName lastName email phoneNumber title organization clinicCode superDoctor addresss specialty regnumber"
  );
    if(!doctors){
      return res.status(404).json({ message: "sorry, the requested doctor was not found"});
    }

    res.status(200).json({ doctors });

  }catch(error){
    res.status(500).json({ message: "error getting practice doctors"});
  }
};


//get patients medications...
export const getPatientsMedications = async(req:any, res: Response) => {
  try{
    const doctor_id = req.doctor._id;
    const doctor = req.doctor;
    const userId = req.params.patient_id;
    if(!userId){
      return res.status(400).json({ message: "missing patient_id in url params"});
    }
    const patient = await PatientModel.findById(userId, {
      email: 1,
      firstName: 1,
      surname: 1,
      phoneNumber: 1,
      hmo: 1,
      dateOFBirth: 1,
      _id: 0,
    });

    /* 
      patient doesnt have a DOB property unlike the design..
    */

    if(!patient){
      return res.status(400).json({ message: "patient not found or does not exist"})
    }
    // const medications = await MedicationModel.find().populate("medicationId");
    const medications = await UserMedicationModel.find({ userId }, {
      last_filled_date: 1,
      refills_left: 1,
      status: 1,
      createdAt: 1,
    }).populate({ path: "medicationId", select: "name" });

   res.status(200).json({ medications, patient });
  }catch(error){
    res.status(500).json({ message: "error getting patients medications"});
    console.log("error getting patients medications: ", error)
  }
}
