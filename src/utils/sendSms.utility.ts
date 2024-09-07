import { SendSms } from '../types/generalTypes';
import fetch from "node-fetch";

export const sendSms = ({to,sms}:SendSms)=>{
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