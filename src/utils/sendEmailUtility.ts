import {
  SendEmailType,
  sendGiftTopUpEmailType,
  sendTopUpEmailType,
} from "../types/generalTypes";
import nodemailer from "nodemailer";
import {
  htmlMailTemplate,
  htmlPasswordRecoveryMailTemplate,
  receiverEmailTemplate,
  senderEmailTemplate,
  walletTopupEmailTemplate,
} from "../templates/mailTemplate";
import SMTPTransport from "nodemailer/lib/smtp-transport";

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

export const sendGiftTopUpSenderEmail = async ({
  amount,
  recipientId,
  recipientName,
  emailTo,
  subject,
  senderName,
}: sendGiftTopUpEmailType) => {
  // Init the nodemailer transporter
  transporterInit();

  try {
    let response = await transporter.sendMail({
      from: "Theraswift",
      to: emailTo,
      subject: subject,
      html: senderEmailTemplate(
        amount,
        recipientId!,
        recipientName!,
        senderName!
      ),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const sendGiftTopUpRecipientEmail = async ({
  amount,
  senderId,
  recipientId,
  senderName,
  emailTo,
  subject,
  recipientName,
}: sendGiftTopUpEmailType) => {
  // Init the nodemailer transporter
  transporterInit();
  try {
    let response = await transporter.sendMail({
      from: "Theraswift",
      to: emailTo,
      subject: subject,
      html: receiverEmailTemplate(
        amount,
        senderId!,
        senderName!,
        recipientId!,
        recipientName!
      ),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const sendTopUpEmail = async ({
  amount,
  referenceId,
  emailTo,
  subject,
  name,
}: sendTopUpEmailType) => {
  // Init the nodemailer transporter
  transporterInit();

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


export const sendPasswordRecoveryEmail = async ({
  emailTo,
  subject,
  otp,
  firstName
}: SendEmailType) => {
  // Init the nodemailer transporter
  transporterInit();

  try {
    let response = await transporter.sendMail({
      from: "Theraswift",
      to: emailTo,
      subject: subject,
      html: htmlPasswordRecoveryMailTemplate(otp,firstName),
    });
    return response;
  } catch (error) {
    throw error;
  }
};