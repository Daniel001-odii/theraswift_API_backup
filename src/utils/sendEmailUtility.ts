import { SendEmailType } from "../types/generalTypes";
import nodemailer from "nodemailer";
import { htmlMailTemplate } from "../templates/mailTemplate";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const sendEmail = async ({
  emailTo,
  subject,
  otp,
  firstName,
}: SendEmailType) => {
  // Define the nodemailer transporter
  const transporter = nodemailer.createTransport({
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

  try {
    let response = await transporter.sendMail({
      from: "Theraswift",
      to: emailTo,
      subject: subject,
      html: htmlMailTemplate(otp, firstName),
    });
    return response;
  } catch (error) {
    throw error;
  }
};
