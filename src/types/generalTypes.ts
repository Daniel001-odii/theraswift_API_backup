import { Request, Response, NextFunction } from "express";


export type ExpressArgs = {
    req: Request,
    res: Response,
    next?: NextFunction
};

export type SendSms = {to:string,sms:string}

export type SendEmailType = {emailTo:string,subject:string,otp:string,firstName:string}