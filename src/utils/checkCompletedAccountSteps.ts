import DoctotModel from "../doctor/modal/doctor_reg.modal";
import PatientModel from "../doctor/modal/patient_reg.model";


export async function updateCompletedAccountSteps(doctorId: string, clinicCode: string) {
  const doctor = await DoctotModel.findById(doctorId)
  if (!doctor) {
    return null;
  }

  // Check if the doctor is a super doctor
  if (doctor.superDoctor) {
    const otherDoctors = await DoctotModel.find({ clinicCode });
    doctor.completedAccountSteps.step1.addedProviders = otherDoctors.length > 1;
  }

  // Check if there are patients associated with this doctor
  const patients = await PatientModel.find({ doctorId: doctorId })
  doctor.completedAccountSteps.step3.addedPatients = patients.length > 0;

  await doctor.save()

  return doctor;
}
