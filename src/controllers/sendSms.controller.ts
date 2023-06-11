import { Request, Response } from "express";
import { sendSms } from "../utils/sendSmsUtility";

export const sendSmsController = async (req: Request, res: Response) => {
  try {
    const { smsInformation, mobileNumber } = req.body;

    let data = { to: mobileNumber, sms:smsInformation };

    sendSms(data);
  } catch (err: any) {
    res.send(400).json({ error: err.message });
  }
};
