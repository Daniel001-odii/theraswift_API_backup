import DoctorModel from "../modal/doctor_reg.modal";
import { Request, Response } from "express";

export const editDoctorProfile = async (req: any, res: Response) => {
  try {
    const doctor_id = req.doctor._id;
    const doctor = await DoctorModel.findById(doctor_id)

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" })
    }

    const { firstName, lastName, phoneNumber, title, organization, addresss } = req.body;

    Object.assign(doctor, {
      firstName: firstName || doctor.firstName,
      lastName: lastName || doctor.lastName,
      phoneNumber: phoneNumber || doctor.phoneNumber,
      title: title || doctor.title,
      organization: organization || doctor.organization,
      addresss: addresss || doctor.addresss,
    })

    //Editting Profile Details Is Basically Verifying It
    // doctor.completedActionSteps.step1.verifiedProfileDetails = true;
    doctor.completedAccountSteps.step1.verifiedProfileDetails = true;

    await doctor.save()

    res.status(200).json({ message: "Profile updated successfully!" })
  } catch (error: any) {
    console.log("Error editing doctor profile: ", error)
    res.status(500).json({ message: "Couldn't update profile", error: error.message })
  }
}