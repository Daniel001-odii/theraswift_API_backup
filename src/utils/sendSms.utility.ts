import { SendSms } from '../types/generalTypes';
import fetch from "node-fetch";


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = require('twilio')(accountSid, authToken);


export const sendSms = ({ to, sms }: SendSms) => {
   client.messages.create({
    body: sms,
    from: twilioPhoneNumber,
    to: to,
   }).then((message:any) => console.log(message.sid))
}

export const sendSms_old = ({to,sms}:SendSms)=>{
  const data = {
    to,
    from: "N-Alert",
    sms,
    type: "plain",
    api_key: process.env.TERMI_API_KEY,
    channel: "dnd",
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
    
  fetch("https://v3.api.termii.com/api/sms/send", options)
  .then((response) => {
    console.log("response from sent message ", response);
  })
  .catch((error) => {
    console.error(error);
    throw error;
  }); 
}