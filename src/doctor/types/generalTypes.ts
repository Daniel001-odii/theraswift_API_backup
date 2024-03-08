
export type SendEmailType = {
  emailTo: string;
  subject: string;
  otp: string;
  firstName?: string;
};

export type SendEmailGeneratType = {
  emailTo: string;
  subject: string;
  html: any
};