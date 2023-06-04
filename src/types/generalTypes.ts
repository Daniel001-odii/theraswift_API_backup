import { Request, Response, NextFunction } from "express";
import { Multer } from "multer";

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
  firstName?: string;
};

export type orderStatusEmailType = {
  emailTo: string;
  subject: string;
  orderStatus?: string;
  firstName?: string;
};

export type orderCompletedEmailType = {
  emailTo: string;
  subject: string;
  deliveryDate:string,
  orderId:string,
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

export type sendTopUpEmailType = {
  amount: string;
  referenceId?: string;
  emailTo: string;
  subject: string;
  name: string;
};

export type CustomFileAppendedRequest = {
  file: {
    buffer: Buffer;
    mimetype: string;
    filename: string;
  } & Multer &
    Request;
  body: any;
  params:any
};
