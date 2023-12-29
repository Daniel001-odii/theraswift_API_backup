import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import FrequenceAskModel from "../models/frequenceAskQuestion.model";
import NewsletterModel from "../../user/models/newsletter.model";


// add frequence question ans ansawer
export const adminFrequenceAskController = async (
    req: any,
    res: Response,
    next: NextFunction
) => {

  try {
    const {
        question,
        answer,
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newFreuenceAsk = new FrequenceAskModel({
        question,
        answer
    })

    newFreuenceAsk.save()
   
    return res.status(200).json({ message: "frequency question and answe successfully added" });

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


// get all the newsletter scriber
export const adminNewsletterSubcriberController = async (
    req: any,
    res: Response,
    next: NextFunction
) => {

  try {
    const {
       
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newsletterScriber = await NewsletterModel.find()
   
    return res.status(200).json({ 
        newsletterScriber
    });

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}