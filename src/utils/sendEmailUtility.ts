import {
  SendEmailType,
  sendGiftTopUpEmailType,
  sendTopUpEmailType,
} from "../types/generalTypes";
import nodemailer from "nodemailer";
import {
  htmlMailTemplate,
  senderEmailTemplate,
  walletTopupEmailTemplate,
} from "../templates/mailTemplate";
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

export const sendGiftTopUpSenderEmail = async ({
  amount,
  recipientId,
  recipientName,
  emailTo,
  subject,
}: sendGiftTopUpEmailType) => {
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
      html: senderEmailTemplate(amount, recipientId!, recipientName!, subject),
    });
    return response;
  } catch (error) {
    throw error;
  }
};


export const sendGiftTopUpRecipientEmail  = async ({
  amount,
  senderId,
  senderName,
  emailTo,
  subject,
}: sendGiftTopUpEmailType) => {
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
      html: senderEmailTemplate(amount, senderId!, senderName!, subject),
    });
    return response;
  } catch (error) {
    throw error;
  }
};




export const sendTopUpEmail  = async ({
  amount,
  referenceId,
  emailTo,
  subject,
  name
}: sendTopUpEmailType) => {
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
      html: walletTopupEmailTemplate(name!, amount!, referenceId!),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// 