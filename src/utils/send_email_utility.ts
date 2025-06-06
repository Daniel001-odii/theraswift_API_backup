import SMTPTransport from "nodemailer/lib/smtp-transport";
import nodemailer from "nodemailer";
import { htmlMailTemplate } from "../templates/sendEmailTemplate";
import { SendEmailType } from "../doctor/types/generalTypes";
import { accountDeleteEmailTemplate } from "../templates/accountDeleteTemp";
import { accountVerifyTemplate } from "../templates/userAccountVerifyTemplate";

let transporter: any;

const transporterInit = () => {
    // Define the nodemailer transporter
    transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        secureConnection: false,
        port: 465,
        auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
        },
        tls: {
        rejectUnauthorized: true,
        },
    } as SMTPTransport.Options);
};

export const sendEmail = async ({
    emailTo,
    subject,
    otp,
    firstName,
  }: SendEmailType) => {
    // Init the nodemailer transporter
    transporterInit();
  
    try {
      let response = await transporter.sendMail({
        from: "Theraswift",
        to: emailTo,
        subject: subject,
        html: htmlMailTemplate(otp, firstName!),
      });
      return response;
    } catch (error) {
      throw error;
    }
  };


export const sendUserAccountVerificationEmail = async ({
    emailTo,
    subject,
    otp,
    firstName,
  }: SendEmailType) => {
    // Init the nodemailer transporter
    transporterInit();
  
    try {
      let response = await transporter.sendMail({
        from: "Theraswift",
        to: emailTo,
        subject: subject,
        html: accountVerifyTemplate(otp, firstName!),
      });
      return response;
    } catch (error) {
      throw error;
    }
  };


export const sendAccountDeleteEmail = async ({
    emailTo,
    subject,
    otp,
    firstName,
  }: SendEmailType) => {
    // Init the nodemailer transporter
    transporterInit();
  
    try {
      let response = await transporter.sendMail({
        from: "Theraswift",
        to: emailTo,
        subject: subject,
        html: accountDeleteEmailTemplate(otp, firstName!),
      });
      return response;
    } catch (error) {
      throw error;
    }
  };