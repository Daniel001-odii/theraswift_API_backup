import { OTP_EXPIRY_TIME } from "../utils/utils";

export const htmlMailTemplate = (otp: string, firstName: string) => `
  <html>
    <head>
      <style>
        body {
          font-family: sans-serif;
          font-size: 13px;
          background-color: #f4f4f4;
        }
        .container {
          margin: 20px auto;
          max-width: 600px;
          background-color: #ffffff;
          border-radius: 5px;
          box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
        }
        .otp {
          display: inline-block;
          padding: 10px;
          border-radius: 5px;
          background-color: #ddd;
          box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(5px);
          font-size: 24px;
          font-weight: bold;
          color: #333333;
          cursor: pointer;
        }
        p{
            color: #333333;
            font-size: 13px;
            display: block
        }
      </style>
    </head>
    <body>
      <div class="container" style="background-color: #f2f2f2; padding: 20px;display:block">
      <h2 style="color: #333333;text-transform:capitalize">Dear ${firstName},</h2>
      <p style="color: #333333;">We have received a request to verify your email address.</p>
      <p style="color: #333333;">Please use the following OTP to verify your email address:</p>
        <div class="otp">${otp}</div>
        <p>This OTP will expire in ${OTP_EXPIRY_TIME / (60 * 1000)} minutes.</p>
        <p>If you did not request this code, please ignore this email.</p>
        <p style="color: #333333;">Thank you for choosing TheraSwift.</p>
        <p style="color: #333333;">Best regards,</p>
        <p style="color: #333333;">Theraswift Team</p>
      </div>
    </body>
  </html>
`;

export const senderEmailTemplate = (
  amount: string,
  recipientId: string,
  recipientName: string,
  subject: string
): string => `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<style type="text/css">
		body {
			font-family: Arial, sans-serif;
			font-size: 14px;
			color: #333333;
		}

		.container {
			background-color: #f4f4f4;
			padding: 20px;
			border-radius: 5px;
			box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
			max-width: 600px;
			margin: 0 auto;
		}

		h1 {
			font-size: 24px;
			font-weight: normal;
			margin: 0;
			padding: 0;
			color: #333333;
		}

		p {
			margin: 10px 0;
			padding: 0;
			color: #333333;
		}

		.amount {
			font-size: 18px;
			font-weight: bold;
			color: #008000;
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>${subject}</h1>
		<p>Dear ${recipientName},</p>
		<p>We are pleased to inform you that a gift balance top-up of <span class="amount">$${parseInt(
      amount
    ).toFixed(2)}</span> has been successfully transferred to your account.</p>
		<p>Thank you for using our services.</p>
		<p>Best regards,</p>
		<p>The Sender</p>
	</div>
</body>
</html>
`;

export const receiverEmailTemplate = (
  amount: string,
  senderId: string,
  senderName: string,
  subject: string
): string => `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<style type="text/css">
		body {
			font-family: Arial, sans-serif;
			font-size: 14px;
			color: #333333;
		}

		.container {
			background-color: #f4f4f4;
			padding: 20px;
			border-radius: 5px;
			box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
			max-width: 600px;
			margin: 0 auto;
		}

		h1 {
			font-size: 24px;
			font-weight: normal;
			margin: 0;
			padding: 0;
			color: #333333;
		}

		p {
			margin: 10px 0;
			padding: 0;
			color: #333333;
		}

		.amount {
			font-size: 18px;
			font-weight: bold;
			color: #008000;
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>${subject}</h1>
		<p>Dear ${senderName},</p>
		<p>We are pleased to inform you that a gift balance top-up of <span class="amount">$${amount.toFixed(
      2
    )}</span> has been successfully transferred to the account of the recipient.</p>
		<p>Thank you for using our services.</p>`;
