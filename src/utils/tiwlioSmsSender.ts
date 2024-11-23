// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure


import { SendSms } from '../types/generalTypes';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = require('twilio')(accountSid, authToken);


export const sendTwilioSMS = ({ to, sms }: SendSms) => {
   client.messages.create({
    body: sms,
    from: twilioPhoneNumber,
    to: to,
   }).then((message:any) => console.log(message.sid))
}