import { Request, Response, NextFunction } from "express";

export type ExpressArgs = {
  req: Request;
  res: Response;
  next?: NextFunction;
};

export type SendSms = { to: string; sms: string };

export type SendEmailType = {
  emailTo: string;
  subject: string;
  otp: string;
  firstName: string;
};

export type sendGiftTopUpEmailType = {
  amount: string;
  recipientId?: string;
  recipientName?: string;
  emailTo: string;
  subject: string;
  senderId?: string;
  senderName?: string;
};
