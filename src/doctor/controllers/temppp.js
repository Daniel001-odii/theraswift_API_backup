export const patientPrescriptionController2 = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;

     /*    
        const {
            patientId,
            dosage,
            frequency,
            route,
            duration,
            medicationId
        } = req.body; 
    */

        /* 
            med_array = [
                {patientId, dosage, fre...},
                {patientId, dosage, fre...},
                {patientId, dosage, fre...}
            ]
        */

        const { medication_array } = req.body;

        medication_array.forEach(medication => {

            let medication_id = medication?.medicationId;
            let patient_id = medication.patientId;
            let dosage = medication.dosage;
            let frequency = medication.frequency;
            let route = medication.route;

            
        });

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        // check if patient exist
        const patientExists = await PatientModel.findOne({ _id: patientId });
        if (!patientExists) {
            return res
            .status(401)
            .json({ message: "patient does not exist" });
        }

        //check if the medication is available
        const medication = await MedicationModel.findOne({_id: medicationId});
        if (!medication) {
            return res
            .status(401)
            .json({ message: "medication dose not exist" });
        };

        // Save patient prescription  to MongoDB
        const patientPrescription = new PatientPrescriptionModel({
            dosage,
            frequency,
            route,
            duration,
            status: "pending",
            doctorId: doctor._id,
            clinicCode: doctor.clinicCode,
            // medicationId: medicationId,
            patientId
        });

        patientPrescription.medications.push(...medicationId);

        const patientPrescriptionSaved = await patientPrescription.save();


        let medication_total = 0;

        for (const element of patientPrescription.medications) {
            const medication_: any = await MedicationModel.findById(element);
            if (medication_) {
                medication_total += medication_.price; // Add the price of each medication to the total
                // console.log("Medication details: ", medication_);
            }
        }
    
        // medication_total = medication_?.price;


        /* 
            SEND USER AN EMAIL FOR NEW PRESCRIPTIONS
        */
        const email_html = "<p>new prescription from theraswift: click the link to view</p>"
        let emailData = {
            emailTo: patientExists.email,
            subject: "Theraswift New Prescription",
            html: email_html,
          };
        // send prescription as email to user...
        // await sendEmail(emailData);

        const patient_phone = patientExists.phoneNumber;

        const sms_payload = {
            to: `+${patient_phone.toString()}`,
            sms: `Hi ${patientExists.firstName}, heres a link to check out your prescription: theraswift.co/prescriptions/${patientPrescription._id}/checkout`
          };
      
        await sendSms(sms_payload);



        return res.status(200).json({
            message: `precription successfully added for ${patientExists.firstName}`,
            patient:{
                id: patientExists._id,
                email: patientExists.email,
                firstName: patientExists.firstName,
                surname: patientExists.surname,
                phoneNumber: patientExists.phoneNumber,
                gender: patientExists.gender,
                address: patientExists.address,
                dateOFBirth: patientExists.dateOFBirth,
                doctorId: patientExists.doctorId,
            
            },
            prescription:{
                dosage: patientPrescriptionSaved.dosage,
                frequency: patientPrescriptionSaved.frequency,
                route: patientPrescriptionSaved.route,
                duration: patientPrescriptionSaved.duration,
                status: patientPrescriptionSaved.status, 
                medications: patientPrescriptionSaved.medications      
            },

            total_amount: `total_amnt: ${medication_total}`,

        });


    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}