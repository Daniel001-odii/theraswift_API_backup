export  const modifiedPhoneNumber = (mobileNumber:string) => {
    if (mobileNumber.charAt(0) === "0") {
      let n = mobileNumber.substring(1);
      return "234" + n.toString();
    } else {
      return mobileNumber.toString();
    }
  };