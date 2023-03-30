import signUpController from "./signup.controller";
import loginController from "./login.controller";
import rootController from "./root.controller";
import topUpWalletController from "./topUpWallet.controller";
import {
  mobileOtpController,
  mobileOtpResendController,
  mobileOtpVerificationController,
} from "./mobileOtp.controller";
import {
  resendEmailController,
  sendEmailController,
  verifyEmailController,
} from "./emailOtp.controller";

export {
  signUpController,
  loginController,
  rootController,
  topUpWalletController,
  mobileOtpController,
  mobileOtpResendController,
  mobileOtpVerificationController,
  resendEmailController,
  sendEmailController,
  verifyEmailController,
};
