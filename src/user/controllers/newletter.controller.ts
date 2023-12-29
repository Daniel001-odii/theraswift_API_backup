import { validationResult } from "express-validator";
import { Request, Response } from "express";
import NewsletterModel from "../models/newsletter.model";
import FrequenceAskModel from "../../admin/models/frequenceAskQuestion.model";


//subscrib for newsletter /////////////
export const subcribForNewsletterController = async (
    req: any,
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


    const checkEmail = await NewsletterModel.findOne({email})

    if (checkEmail) {
        return res
        .status(401)
        .json({ message: "email already added to newsletter" });
    }

    const newScriber = new NewsletterModel({email});

    await newScriber.save()

    return res.status(200).json({
      message: "email succefully added to newsletter",
      
    })
  

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//get frequncy question and answe /////////////
export const frequenceAskQuestionController = async (
  req: any,
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


  const FrequenceQuestionAnwer = await FrequenceAskModel.find()

  return res.status(200).json({
    FrequenceQuestionAnwer,
    
  })


} catch (err: any) {
  // signup error
  res.status(500).json({ message: err.message });
}
}