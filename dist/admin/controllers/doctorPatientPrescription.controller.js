"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminGetDoctorSingleDeliveredPatientOrder = exports.adminGetDoctorDeliveredPatientOrder = exports.adminGetDoctorSingleProgressPatientOrder = exports.adminGetDoctorPatientProgressOrder = exports.adminGetDoctorSinglePendingPatientOrder = exports.adminGetDoctorPendingPatientOrder = void 0;
const express_validator_1 = require("express-validator");
// admin get doctor patient order that is pending
const adminGetDoctorPendingPatientOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /*   let {
              clinicCode
          } = req.query
  
          const errors = validationResult(req);
  
          if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array() });
          }
          
          const patients = await PatientModel.find({clinicCode})
  
          let patientPendingOrders = []
  
          for (let i = 0; i < patients.length; i++) {
              const patient = patients[i];
  
              const pendingOrders = await PatientOrderModel.find({status: "pending", patientId: patient._id})
  
              if (pendingOrders.length < 1) continue
  
              let PendingOrder = []
  
              for (let i = 0; i < pendingOrders.length; i++) {
                  const pendingOrder = pendingOrders[i];
                  const prescription = await PatietPRescription.findOne({_id: pendingOrder.patientPrescriptionId})
                  if (!prescription) continue
                  const medication = await MedicationModel.findOne({_id: prescription.medicationId})
                  if (!medication) continue
  
                  const obj = {
                      order: pendingOrder,
                      prescription,
                      medication
                  }
  
                  PendingOrder.push(obj)
  
              }
  
              const objTwo = {
                  patient,
                  order: PendingOrder
              }
  
              patientPendingOrders.push(objTwo)
              
          }
  
          const totalDoctor = await DoctorModel.countDocuments(); // Get the total number of documents
  
          return res.status(200).json({
              patientPendingOrders
          }) */
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminGetDoctorPendingPatientOrder = adminGetDoctorPendingPatientOrder;
// admin get  doctor single patient order that is pending
const adminGetDoctorSinglePendingPatientOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { clinicCode, patientId } = req.query;
        /*  const errors = validationResult(req);
 
         if (!errors.isEmpty()) {
             return res.status(400).json({ errors: errors.array() });
         }
       
         const patient = await PatientModel.findOne({_id: patientId, clinicCode});
 
         if (!patient) {
             return res
             .status(401)
             .json({ message: "incorrect patient ID" });
         }
 
         const pendingOrders = await PatientOrderModel.find({status: "pending", patientId: patient._id})
 
         if (pendingOrders.length < 1) {
             return res
             .status(401)
             .json({ message: "no pending order for this patient" });
         }
 
         let PendingOrder = []
 
         for (let i = 0; i < pendingOrders.length; i++) {
             const pendingOrder = pendingOrders[i];
             const prescription = await PatietPRescription.findOne({_id: pendingOrder.patientPrescriptionId})
             if (!prescription) continue
             const medication = await MedicationModel.findOne({_id: prescription.medicationId})
             if (!medication) continue
 
             const obj = {
                 order: pendingOrder,
                 prescription,
                 medication
             }
 
             PendingOrder.push(obj)
 
         }
 
         const objTwo = {
             patient,
             order: PendingOrder
         }
 
         const totalDoctor = await DoctorModel.countDocuments(); // Get the total number of documents
 
         return res.status(200).json({
             patientPendingOrders: objTwo
         }) */
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminGetDoctorSinglePendingPatientOrder = adminGetDoctorSinglePendingPatientOrder;
// admin get doctor patient order that is progress
const adminGetDoctorPatientProgressOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { clinicCode } = req.query;
        const errors = (0, express_validator_1.validationResult)(req);
        /*
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                
                const patients = await PatientModel.find({clinicCode})
        
                let patientProgressOrders = []
        
                for (let i = 0; i < patients.length; i++) {
                    const patient = patients[i];
        
                    const pendingOrders = await PatientOrderModel.find({status: "progress", patientId: patient._id})
        
                    if (pendingOrders.length < 1) continue
        
                    let PendingOrder = []
        
                    for (let i = 0; i < pendingOrders.length; i++) {
                        const pendingOrder = pendingOrders[i];
                        const prescription = await PatietPRescription.findOne({_id: pendingOrder.patientPrescriptionId})
                        if (!prescription) continue
                        const medication = await MedicationModel.findOne({_id: prescription.medicationId})
                        if (!medication) continue
        
                        const obj = {
                            order: pendingOrder,
                            prescription,
                            medication
                        }
        
                        PendingOrder.push(obj)
        
                    }
        
                    const objTwo = {
                        patient,
                        order: PendingOrder
                    }
        
                    patientProgressOrders.push(objTwo)
                    
                }
        
                const totalDoctor = await DoctorModel.countDocuments(); // Get the total number of documents
        
                return res.status(200).json({
                    patientProgressOrders
                }) */
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminGetDoctorPatientProgressOrder = adminGetDoctorPatientProgressOrder;
// admin get  doctor single patient order that is in progress
const adminGetDoctorSingleProgressPatientOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { clinicCode, patientId } = req.query;
        /* const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
      
        const patient = await PatientModel.findOne({_id: patientId, clinicCode});

        if (!patient) {
            return res
            .status(401)
            .json({ message: "incorrect patient ID" });
        }

        const pendingOrders = await PatientOrderModel.find({status: "progress", patientId: patient._id})

        if (pendingOrders.length < 1) {
            return res
            .status(401)
            .json({ message: "no progress order for this patient" });
        }

        let PendingOrder = []

        for (let i = 0; i < pendingOrders.length; i++) {
            const pendingOrder = pendingOrders[i];
            const prescription = await PatietPRescription.findOne({_id: pendingOrder.patientPrescriptionId})
            if (!prescription) continue
            const medication = await MedicationModel.findOne({_id: prescription.medicationId})
            if (!medication) continue

            const obj = {
                order: pendingOrder,
                prescription,
                medication
            }

            PendingOrder.push(obj)

        }

        const objTwo = {
            patient,
            order: PendingOrder
        }

        const totalDoctor = await DoctorModel.countDocuments(); // Get the total number of documents

        return res.status(200).json({
            patientPendingOrders: objTwo
        })
 */
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminGetDoctorSingleProgressPatientOrder = adminGetDoctorSingleProgressPatientOrder;
// admin get doctor patient order that is delivered
const adminGetDoctorDeliveredPatientOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { clinicCode } = req.query;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        /* const patients = await PatientModel.find({clinicCode})

        let patientDeliveredOrders = []

        for (let i = 0; i < patients.length; i++) {
            const patient = patients[i];

            const pendingOrders = await PatientOrderModel.find({status: "delivered", patientId: patient._id})

            if (pendingOrders.length < 1) continue

            let PendingOrder = []

            for (let i = 0; i < pendingOrders.length; i++) {
                const pendingOrder = pendingOrders[i];
                const prescription = await PatietPRescription.findOne({_id: pendingOrder.patientPrescriptionId})
                if (!prescription) continue
                const medication = await MedicationModel.findOne({_id: prescription.medicationId})
                if (!medication) continue

                const obj = {
                    order: pendingOrder,
                    prescription,
                    medication
                }

                PendingOrder.push(obj)

            }

            const objTwo = {
                patient,
                order: PendingOrder
            }

            patientDeliveredOrders.push(objTwo)
            
        }

        const totalDoctor = await DoctorModel.countDocuments(); // Get the total number of documents

        return res.status(200).json({
            patientDeliveredOrders
        })
 */
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminGetDoctorDeliveredPatientOrder = adminGetDoctorDeliveredPatientOrder;
// admin get  doctor single patient order that is delivered
const adminGetDoctorSingleDeliveredPatientOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { clinicCode, patientId } = req.query;
        /* const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
      
        const patient = await PatientModel.findOne({_id: patientId, clinicCode});

        if (!patient) {
            return res
            .status(401)
            .json({ message: "incorrect patient ID" });
        }

        const pendingOrders = await PatientOrderModel.find({status: "delivered", patientId: patient._id})

        if (pendingOrders.length < 1) {
            return res
            .status(401)
            .json({ message: "no delivered order for this patient" });
        }

        let PendingOrder = []

        for (let i = 0; i < pendingOrders.length; i++) {
            const pendingOrder = pendingOrders[i];
            const prescription = await PatietPRescription.findOne({_id: pendingOrder.patientPrescriptionId})
            if (!prescription) continue
            const medication = await MedicationModel.findOne({_id: prescription.medicationId})
            if (!medication) continue

            const obj = {
                order: pendingOrder,
                prescription,
                medication
            }

            PendingOrder.push(obj)

        }

        const objTwo = {
            patient,
            order: PendingOrder
        }

        const totalDoctor = await DoctorModel.countDocuments(); // Get the total number of documents

        return res.status(200).json({
            patientPendingOrders: objTwo
        })
 */
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminGetDoctorSingleDeliveredPatientOrder = adminGetDoctorSingleDeliveredPatientOrder;
