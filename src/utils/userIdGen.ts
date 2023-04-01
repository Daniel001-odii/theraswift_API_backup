export const userIdGen = (mobileNumber: string) => {
    let n;
    if (mobileNumber.charAt(0) === "0") {
      n = mobileNumber.substring(1);
      return n.toString();
    } else if (mobileNumber.startsWith("234")) {
      n = mobileNumber.substring(3);
      return n.toString();
    }else if (mobileNumber.startsWith("+234")) {
      n = mobileNumber.substring(4);
      return n.toString();
    }
  };
