//patient medication detail
export const patientPrescriptionDetailController = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;

        const patientId = req.params.patient_id;

        /* const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
         */
        if(!patientId){
            return res.status(400).json({ message: "please provide a valid patient_id in url params"});
        }
        // check if patient exist
        const patientExists = await PatientModel.findOne({ _id: patientId }).select("-password");
        if (!patientExists) {
            return res
            .status(401)
            .json({ message: "patient does not exist" });
        }

        const patientPrescriptionDetails = await PatientPrescriptionModel.find({patientId: patientId}).sort({createdAt: -1});

        let patientMedications = [];

        for (let i = 0; i < patientPrescriptionDetails.length; i++) {
            const patientPrescriptionDetail = patientPrescriptionDetails[i];
            const medication = await MedicationModel.findOne({_id: patientPrescriptionDetail.medicationId})
            
            const obj = {
                patientPrescriptionDetail,
                medication
            }

            patientMedications.push(obj)
        }


        return res.status(200).json({
            patient: patientExists,
            patientMedications

        })
      
    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });

        
    }
}