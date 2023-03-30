// Generate a new OTP
export function generateOTP() {
    let otp = "";
    const allowedChars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < 6; i++) {
      otp += allowedChars.charAt(
        Math.floor(Math.random() * allowedChars.length)
      );
    }
    return otp;
  }
