import fetch from "node-fetch";

export const verifyPaystackPayment = (reference: string) => {
  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: `/transaction/verify/:${reference}`,
    method: "GET",
    headers: {
      Authorization:`Bearer ${process.env.PAYSTACK_API_KEY}`,
    },
  };

  fetch(`https://${options.hostname}${options.path}`, {
    method: options.method,
    headers: options.headers,
  })
    .then((res: any) => res.json())
    .then((data: any) => console.log(data))
    .catch((error: any) => {
      console.error(error);
      throw error;
    });
};
