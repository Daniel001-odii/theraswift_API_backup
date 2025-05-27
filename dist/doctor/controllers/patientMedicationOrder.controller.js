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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPatientPrecriptionAsLinks = exports.prescribeMedicationForUser = exports.getpatientPriscriptionDeliverdeController = exports.getpatientPriscriptionProgressController = exports.getpatientPriscriptionPendindController = exports.patientOderOutPocketController = exports.patientOderHmoController = void 0;
const express_validator_1 = require("express-validator");
const medication_model_1 = __importDefault(require("../../admin/models/medication.model"));
const patientPrescription_model_1 = __importDefault(require("../modal/patientPrescription.model"));
const patient_reg_model_1 = __importDefault(require("../modal/patient_reg.model"));
const patientOrder_model_1 = __importDefault(require("../modal/patientOrder.model"));
// doctor send patient prescription for hmo
const patientOderHmoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const { patientId, } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        /*
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
        
                //get all patient prescription
                const patientPrescriptions = await PatientPrescriptionModel.find({patientId});
                if (patientPrescriptions.length < 1) {
                    return res
                    .status(401)
                    .json({ message: "no prescripton for this patient" });
                }
        
                for (let i = 0; i < patientPrescriptions.length; i++) {
                    const patientPrescription = patientPrescriptions[i];
        
                    const medication = await MedicationModel.findOne({_id: patientPrescription.medicationId})
        
                    if (!medication) continue;
        
                    const patientOrder =  new PatientOrderModel({
                        patientPrescriptionId: patientPrescription._id,
                        patientId: patientId,
                        medicationId: medication._id,
                        clinicCode: patientPrescription.clinicCode,
                        patientPayment: medication.price,
                        hmoPayment: 0,
                        status: "pending",
                        toHmo: "yes",
                        hmoState: "admin",
                    })
        
                    await patientOrder.save();
                    
                }
        
                
                return res.status(200).json({
                    message: "order successfully sent",
                }) */
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.patientOderHmoController = patientOderHmoController;
// doctor send patient prescription out of pocket
const patientOderOutPocketController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const { patientId, } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        /*   if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array() });
          }
          
          // check if patient exist
          const patientExists = await PatientModel.findOne({ _id: patientId });
          if (!patientExists) {
              return res
              .status(401)
              .json({ message: "patient does not exist" });
          }
  
          //get all patient prescription
          const patientPrescriptions = await PatientPrescriptionModel.find({patientId});
          if (patientPrescriptions.length < 1) {
              return res
              .status(401)
              .json({ message: "no prescripton for this patient" });
          }
  
          for (let i = 0; i < patientPrescriptions.length; i++) {
              const patientPrescription = patientPrescriptions[i];
  
              const medication = await MedicationModel.findOne({_id: patientPrescription.medicationId})
  
              if (!medication) continue;
  
              const patientOrder =  new PatientOrderModel({
                  patientPrescriptionId: patientPrescription._id,
                  patientId: patientId,
                  medicationId: medication._id,
                  clinicCode: patientPrescription.clinicCode,
                  patientPayment: medication.price,
                  hmoPayment: 0,
                  status: "pending",
                  toHmo: "no",
                  hmoState: "",
              })
  
              await patientOrder.save();
              
          }
   */
        return res.status(200).json({
            message: "order successfully sent",
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.patientOderOutPocketController = patientOderOutPocketController;
// doctor get patient order prescription pendingg
const getpatientPriscriptionPendindController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const { patientId, } = req.query;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // check if patient exist
        const patientExists = yield patient_reg_model_1.default.findOne({ _id: patientId });
        if (!patientExists) {
            return res
                .status(401)
                .json({ message: "patient does not exist" });
        }
        const pendnigOrders = yield patientOrder_model_1.default.find({ patientId, status: "pending" });
        /*  let orderMedication = []
 
         for (let i = 0; i < pendnigOrders.length; i++) {
             const pendnigOrder = pendnigOrders[i];
 
             const patientPriscription = await PatientPrescriptionModel.findOne({_id: pendnigOrder.patientPrescriptionId})
 
             if (!patientPriscription) continue;
 
             const medication = await MedicationModel.findOne({_id: patientPriscription.medicationId})
 
             if (!medication) continue;
 
             const obj = {
                 order: pendnigOrder,
                 patientPriscription,
                 medication,
             }
 
             orderMedication.push(obj)
             
         }
 
         
         return res.status(200).json({
             orderMedication
         })
  */
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getpatientPriscriptionPendindController = getpatientPriscriptionPendindController;
// doctor get patient order prescription progress
const getpatientPriscriptionProgressController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const { patientId, } = req.query;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // check if patient exist
        const patientExists = yield patient_reg_model_1.default.findOne({ _id: patientId });
        if (!patientExists) {
            return res
                .status(401)
                .json({ message: "patient does not exist" });
        }
        /*  const pendnigOrders = await PatientOrderModel.find({patientId, status: "progress"});
 
         let orderMedication = []
 
         for (let i = 0; i < pendnigOrders.length; i++) {
             const pendnigOrder = pendnigOrders[i];
 
             const patientPriscription = await PatientPrescriptionModel.findOne({_id: pendnigOrder.patientPrescriptionId})
 
             if (!patientPriscription) continue;
 
             const medication = await MedicationModel.findOne({_id: patientPriscription.medicationId})
 
             if (!medication) continue;
 
             const obj = {
                 order: pendnigOrder,
                 patientPriscription,
                 medication,
             }
 
             orderMedication.push(obj)
             
         }
 
         
         return res.status(200).json({
             orderMedication
         }) */
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getpatientPriscriptionProgressController = getpatientPriscriptionProgressController;
// doctor get patient order prescription delivered
const getpatientPriscriptionDeliverdeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /*    const doctor = req.doctor;
   
           const {
               patientId,
           } = req.query;
   
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
   
           const pendnigOrders = await PatientOrderModel.find({patientId, status: "delivered"});
   
           let orderMedication = []
   
           for (let i = 0; i < pendnigOrders.length; i++) {
               const pendnigOrder = pendnigOrders[i];
   
               const patientPriscription = await PatientPrescriptionModel.findOne({_id: pendnigOrder.patientPrescriptionId})
   
               if (!patientPriscription) continue;
   
               const medication = await MedicationModel.findOne({_id: patientPriscription.medicationId})
   
               if (!medication) continue;
   
               const obj = {
                   order: pendnigOrder,
                   patientPriscription,
                   medication,
               }
   
               orderMedication.push(obj)
               
           }
   
           
           return res.status(200).json({
               orderMedication
           })
    */
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getpatientPriscriptionDeliverdeController = getpatientPriscriptionDeliverdeController;
const prescribeMedicationForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.params.user_id;
        const { name, price, quantity, medicationImage, prescriptionRequired, form, ingredient, quantityForUser, inventoryQuantity, expiredDate, category, medInfo } = req.body;
        const new_medication = yield new medication_model_1.default({
            name,
            price,
            quantity,
            medicationImage,
            prescriptionRequired,
            form,
            ingredient,
            quantityForUser,
            inventoryQuantity,
            expiredDate,
            category,
            medInfo
        });
        yield new_medication.save();
        res.status(201).json({ message: "new medication created for user" });
    }
    catch (error) {
        res.status(500).json({ error: "error prescribing medication" });
    }
});
exports.prescribeMedicationForUser = prescribeMedicationForUser;
const getAllPatientPrecriptionAsLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const patientId = req._id;
        const precriptions = yield patientPrescription_model_1.default.find({ patientId });
        let formattedPrescription = [];
        precriptions.forEach((unit) => {
            formattedPrescription.push(`precription_link/${patientId}/${unit}`);
        });
        res.status(201).json({ message: "checkout links success", formattedPrescription });
    }
    catch (error) {
        res.status(500).json({ message: "error generating medication links for medications?" });
    }
});
exports.getAllPatientPrecriptionAsLinks = getAllPatientPrecriptionAsLinks;
