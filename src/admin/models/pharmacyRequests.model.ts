import mongoose from "mongoose";


const RequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'AdminReg',
    },
    time: {
        type: Date,
    },
    request_type: {
        type: String,
        enum: ["HMO", "PRC",  "THS"],
        required: [true, "please provide a request type (HMO, PRC or THS)"]
    },
    description: {
        type: String,
        required: true,
    },
    medication: String,
    user:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserReg',
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DoctorReg',
        required: true,
    },
    status: {
        type: String,
        enum: ["approved", 'declined'],
        default: "approved",
    },
   
}, { timestamps: true });


const pharmacyRequestModel = mongoose.model('pharmRequests', RequestSchema);

export default pharmacyRequestModel