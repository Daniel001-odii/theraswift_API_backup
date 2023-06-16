"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifiedPhoneNumber = void 0;
const modifiedPhoneNumber = (mobileNumber) => {
    if (mobileNumber.startsWith("+234")) {
        let n = mobileNumber.substring(4);
        return "234" + n;
    }
    else if (mobileNumber.startsWith("234")) {
        return mobileNumber;
    }
    else if (mobileNumber.startsWith("0")) {
        let n = mobileNumber.substring(1);
        return "234" + n;
    }
    else {
        return "234" + mobileNumber;
    }
};
exports.modifiedPhoneNumber = modifiedPhoneNumber;
