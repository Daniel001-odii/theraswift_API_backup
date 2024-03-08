import SMTPTransport from "nodemailer/lib/smtp-transport";
import nodemailer from "nodemailer";
import { htmlMailTemplate } from "../templates/sendEmailTemplate";
import { SendEmailGeneratType } from "../doctor/types/generalTypes";

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
    html
    }: SendEmailGeneratType) => {
    // Init the nodemailer transporter
    transporterInit();

    try {
        let response = await transporter.sendMail({
        from: "Theraswift",
        //from: "noreply@repairfind.ca",
        to: emailTo,
        subject: subject,
        //html: htmlMailTemplate(otp, firstName!, type),
        html: html,
        });
        return response;
    } catch (error) {
        console.log("error", error)
        throw error;
    }
};