import fetch from "node-fetch";

export const verifyPaystackPayment = async (reference: string) => {
  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: `/transaction/verify/:${reference}`,
    method: "GET",
    headers: {
      Authorization:`Bearer ${process.env.PAYSTACK_API_KEY}`,
    },
  };

  try {
    const res = await fetch(`https://${options.hostname}${options.path}`, {
      method: options.method,
      headers: options.headers,
    });
    const data = await res.json();
    console.log(data);
    if(data.status == false){
      throw Error(data.message)
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}