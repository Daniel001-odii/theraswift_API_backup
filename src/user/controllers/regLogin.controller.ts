import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/userReg.model";
import { modifiedPhoneNumber } from "../../utils/mobilNumberFormatter";
import CodeModel from "../models/code.model";
import FamilyMemberModel from "../models/familyMember.model";
import UserAddressModel from "../models/address.model";
import UserHmoModel from "../models/hmo.model";
import { uploadToS3 } from "../../utils/aws3.utility";
import { v4 as uuidv4 } from "uuid";


//user check email/////////////
export const userCheckEmailController = async (
  req: Request,
  res: Response,
) => {

  try {
    const {
      email,
      
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // try find user with the same email
    const userEmailExists = await UserModel.findOne({ email });
  

    // check if user exists
    if (!userEmailExists) {
      return res
        .status(401)
        .json({ message: "Email do not exists" });
    }

    res.json({
      message: "Email already exist",
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//user check state/////////////
export const userCheckStateController = async (
  req: Request,
  res: Response,
) => {

  try {
    const {
      address,
      state
      
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    res.json({
      message: "deliver location successfully saved",
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}



//user signup /////////////
export const userSignUpController = async (
    req: Request,
    res: Response,
) => {

  try {
    const {
      email,
      password,
      firstName,
      dateOfBirth,
      lastName,
      mobileNumber,
      gender, 
      refererCode,
      operatingLocation,
      address,
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // format mobile number to international format
    let phonenumber = modifiedPhoneNumber(mobileNumber);

    // try find user with the same email
    const userEmailExists = await UserModel.findOne({ email });
    const userNumberExists = await UserModel.findOne({ mobileNumber: phonenumber });

     // check if user exists
     if (userEmailExists || userNumberExists) {
      return res
        .status(401)
        .json({ message: "Email or Mobile Number exists already" });
    }

    // give referer his reward
    if (refererCode) {
      const referer = await UserModel.findOne({refererCode});
       
      if (referer) {
        referer.refererCredit = referer.refererCredit + 500;
        referer.save();
      }
    }

    const storeedCode = await CodeModel.find();
    if(storeedCode.length < 1) {
      const firstCode = new CodeModel({code: 1000});
      await firstCode.save();
    }

    const codestored = await CodeModel.find();
    const {code, _id} = codestored[0];

    const newUserRefererCode = (code + 1).toString();

    // update the code generator
    await CodeModel.findOneAndUpdate({_id}, {code: parseInt(newUserRefererCode)}, {new: true})

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = mobileNumber.substring(1);

    const user = new UserModel({
      email: email,
      userId: userId,
      firstName: firstName,
      dateOfBirth: dateOfBirth,
      lastName: lastName,
      password: hashedPassword,
      mobileNumber: phonenumber,
      gender: gender,
      refererCode: newUserRefererCode,
      refererCredit: 500,
      operatingLocation: operatingLocation,
      address
    });
    
    let userSaved = await user.save();

    res.json({
      message: "Signup successful",
      user: {
        id: userSaved._id,
        userId: userSaved.userId,
        firstName: userSaved.firstName,
        lastName: userSaved.lastName,
        email: userSaved.email,
        gender: userSaved.gender,
        mobileNumber: userSaved.mobileNumber,
        refererCode: userSaved.refererCode,
        refererCredit: userSaved.refererCredit,
        address: userSaved.address,
        state: userSaved.operatingLocation
      },

    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}



//user signin  with email/////////////
export const userEmailSignInController = async (
  req: Request,
  res: Response,
) => {

try {
  const {
    email,
    password,
  } = req.body;
  // Check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // try find user with the same email
  const user= await UserModel.findOne({ email });

   // check if user exists
   if (!user) {
    return res
      .status(401)
      .json({ message: "invalid credential" });
  }

 // compare password with hashed password in database
 const isPasswordMatch = await bcrypt.compare(password, user.password);
 if (!isPasswordMatch) {
   return res.status(401).json({ message: "incorrect credential." });
 }

 if (!user.emailOtp.verified) {
  return res.status(401).json({ message: "email not verified." });
 }

 
  // generate access token
  const accessToken = jwt.sign(
    { 
      id: user?._id,
      email: user.email,
      mobileNumber: user.mobileNumber,
    },
    process.env.JWT_User_SECRET_KEY!,
    { expiresIn: "24h" }
  );

  // return access token
  res.json({
    message: "Login successful",
    Token: accessToken
  });


} catch (err: any) {
  // signup error
  res.status(500).json({ message: err.message });
}

}


//user signin  with mobile number/////////////
export const userMobileNumberSignInController = async (
  req: Request,
  res: Response,
) => {

try {
  const {
    mobileNumber,
    password,
  } = req.body;
  // Check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // format mobile number to international format
  let phonenumber = modifiedPhoneNumber(mobileNumber);

  // try find user with the same email
  const user= await UserModel.findOne({ mobileNumber: phonenumber});

   // check if user exists
   if (!user) {
    return res
      .status(401)
      .json({ message: "invalid credential" });
  }

 // compare password with hashed password in database
 const isPasswordMatch = await bcrypt.compare(password, user.password);
 if (!isPasswordMatch) {
   return res.status(401).json({ message: "incorrect credential." });
 }

 if (!user.phoneNumberOtp.verified) {
  return res.status(401).json({ message: "mobile number not verified." });
 }

 
  // generate access token
  const accessToken = jwt.sign(
    { 
      id: user?._id,
      email: user.email,
      mobileNumber: user.mobileNumber,
    },
    process.env.JWT_User_SECRET_KEY!,
    { expiresIn: "24h" }
  );

  // return access token
  res.json({
    message: "Login successful",
    Token: accessToken
  });


} catch (err: any) {
  // signup error
  res.status(500).json({ message: err.message });
}

}




//get login user deatial/////////////
export const userdetailController = async (
  req: any,
  res: Response,
) => {

  try {
    const {
    
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user;
    const userId = user.id

    //get user info from databas
    const userExist = await UserModel.findOne({_id: userId});

    if (!userExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    res.json({
    user: {
      id: userExist._id,
      userId: userExist.userId,
      email: userExist.email,
      mobileNumber: userExist.mobileNumber,
      firstName: userExist.firstName,
      lastName: userExist.lastName,
      dateOfbirth: userExist.dateOfBirth,
      gender: userExist.gender,
      refererCode: userExist.refererCode,
      referereCredit: userExist.refererCredit,
      reference: userExist.reference,
      operatingLocation: userExist.operatingLocation
    }
      
    });

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//user register his family member /////////////
export const userRegistMemberController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      firstName,
      dateOfBirth,
      lastName,
      gender, 
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user;
    const userId = user.id


    //get user info from databas
    const userExist = await UserModel.findOne({_id: userId});

    if (!userExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const newFamily = new FamilyMemberModel({
      userId: userId,
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dateOfBirth,
      gender: gender
    })

    const saveFamily = await newFamily.save();
  
    res.json({  
      saveFamily    
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//user get his family member detail /////////////
export const userGetMemberController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user;
    const userId = user.id


    //get user info from databas
    const userExist = await UserModel.findOne({_id: userId});

    if (!userExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const families = await FamilyMemberModel.find({userId: userId})
  
    res.json({  
      families
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//user Add new addresss /////////////
export const userAddAddressController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      streetAddress,
      streetNO,
      LGA,
      DeliveryInstruction,
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user;
    const userId = user.id


    //get user info from databas
    const userExist = await UserModel.findOne({_id: userId});

    if (!userExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

   const newAddress = new UserAddressModel({
    userId: userId,
    streetAddress: streetAddress,
    streetNO: streetNO,
    LGA: LGA,
    DeliveryInstruction: DeliveryInstruction
   });

   const savedAddress = await newAddress.save()
  
    res.json({  
      savedAddress
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//user get his addressses /////////////
export const userGetAddressController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
  
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user;
    const userId = user.id


    //get user info from databas
    const userExist = await UserModel.findOne({_id: userId});

    if (!userExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const addresses = await UserAddressModel.find({userId: userId})
  
    res.json({  
      addresses
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}



//user Add hmo /////////////
export const userAddHmoController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
      enrolNumber,
      EnrolName,
      provider,
    } = req.body;

    const file = req.file;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user;
    const userId = user.id


    //get user info from databas
    const userExist = await UserModel.findOne({_id: userId});

    if (!userExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    let hmoImg;

    if (!file) {
      hmoImg = "";
    }else{
      const filename = uuidv4();
      const result = await uploadToS3(req.file.buffer, `${filename}.jpg`);
      hmoImg = result?.Location!;
      
    }

    let enrolNumberDb = "";
    let enrolNameDb = "";
    let providerDb = "";

    if (EnrolName != "") {
      enrolNameDb = EnrolName
    }

    if (enrolNumber != "") {
      enrolNumberDb = enrolNumber
    }

    if (provider != "") {
      providerDb = provider
    }

    const newHmo = new UserHmoModel({
      userId: userId,
      hmoImage: hmoImg,
      enrolName: enrolNameDb,
      enrolNumber: enrolNumberDb,
      provider: providerDb
    })

    const savedHmo = await newHmo.save();
  
    res.json({  
      savedHmo
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//user get hmo detail/////////////
export const userGetHmoController = async (
  req: any,
  res: Response,
) => {

  try {
    const {  
     
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user;
    const userId = user.id


    //get user info from databas
    const userExist = await UserModel.findOne({_id: userId});

    if (!userExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const hmo = await UserHmoModel.find({userId: userId})
  
    res.json({  
      hmo
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}





