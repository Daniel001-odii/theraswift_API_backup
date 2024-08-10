const userReg_model_1 = __importDefault(require("../models/userReg.model"));

const otpGenerator_1 = require("../../utils/otpGenerator");
const send_email_utility_1 = require("../../utils/send_email_utility");


// controller to send user account deletion OTP...
exports.sendDeletionOTP = async (req, res) =>  __awaiter(void 0, void 0, void 0, function* () {
    try{
        // collect user email from client req body...
        const { email } = req.body;

        // find user by email provided...
        const user = yield userReg_model_1.default.findOne({ email });

        // if user is not found... send client response...
        if (!user) {
            return res.status(401).json({ message: "invalid email provided" });
        }

        // if user is found, save otp to user's DB...
        // set userEmailOTP field to random otp generates and also save to user schema...
        const otp = (0, otpGenerator_1.generateOTP)();
        const createdTime = new Date();
        user.emailOtp = {
            otp,
            createdTime,
            verified: true
        };

        let emailData = {
            emailTo: email,
            subject: "Theraswift Account Delete Request",
            otp,
            firstName: user.firstName,
        };
        // (0, send_email_utility_1.sendEmail)(emailData);
        send_email_utility_1(emailData);

        res.status(200).json({ message: "you requested an email deletion OTP. check your mail!"})
    }catch(error){
        console.log("error sending account deletion email: ", error);
        res.status(500).json({ message: error });
    }
});