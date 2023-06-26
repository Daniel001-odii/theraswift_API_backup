"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderCompleteEmailTemplate = exports.orderStatusTemplate = exports.passwordRecoveryMailTemplate = exports.walletTopupEmailTemplate = exports.receiverEmailTemplate = exports.senderEmailTemplate = exports.htmlMailTemplate = void 0;
const utils_1 = require("../utils/utils");
const htmlMailTemplate = (otp, firstName) => `
  <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@300;400&family=Nunito:wght@200;300;400;500;600&display=swap');
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
          font-family: 'Inconsolata', monospace;
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
        <p>This OTP will expire in ${utils_1.OTP_EXPIRY_TIME / (60 * 1000)} minutes.</p>
        <p>If you did not request this code, please ignore this email.</p>
        <p style="color: #333333;">Thank you for choosing TheraSwift.</p>
        <p style="color: #333333;">Best regards,</p>
        <p style="color: #333333;">Theraswift Team</p>
      </div>
    </body>
  </html>
`;
exports.htmlMailTemplate = htmlMailTemplate;
const senderEmailTemplate = (amount, recipientId, recipientName, senderName) => `
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
			font-size:15px
		}

		.amount {
			font-size: 18px;
			font-weight: bold;
			color: #333;
		}
	</style>
</head>
<body>
	<div class="container">
		<p>Dear ${senderName},</p>
		<p>We are pleased to inform you that a gift balance top-up of <span class="amount">NGN${parseInt(amount).toFixed(2)}</span> has been successfully transferred to <b>${recipientName}</b> with the user ID: <b>${recipientId}</b> from your theraWallet balance.</p>
	<p>log into your theraSwift account to learn more.</p>
		<p>Thank you for using our services.</p>
		<p>Best regards,</p>
		<p>Theraswift Team</p>
	</div>
</body>
</html>
`;
exports.senderEmailTemplate = senderEmailTemplate;
// amount, senderId!, senderName!, subject
const receiverEmailTemplate = (amount, senderId, senderName, recieverId, recipientName) => `
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

		p {
			margin: 10px 0;
			padding: 0;
			color: #333333;
			font-size:15px
		}

		.amount {
			font-size: 18px;
			font-weight: bold;
			color: #333;
		}
		h2 {
			color: #333333;
			text-transform: capitalize;
		  }
	</style>
</head>
<body>
	<div class="container">
	<h2>Dear ${recipientName},</h2>
		<p>We are pleased to inform you that a gift balance top-up of <span class="amount">NGN${parseInt(amount).toFixed(2)}</span> has been successfully transferred to your theraWallet from <b>${senderName}</b> with the user ID: <b>${senderId}</b>.</p>
	<p>log into your theraSwift account to learn more.</p>
		<p>Thank you for using our services.</p>
		<p>Best regards,</p>
		<p>TheraSwift Team</p>
	</div>
</body>
</html>
`;
exports.receiverEmailTemplate = receiverEmailTemplate;
const walletTopupEmailTemplate = (recipientName, topupAmount, transactionReference) => `
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
		  h2 {
			color: #333333;
			text-transform: capitalize;
		  }
		  .details {
			color: #333333;
			font-size: 13px;
			display: block;
			margin-top: 10px;
		  }
		  .success {
			display: inline-block;
			padding: 10px;
			border-radius: 5px;
			background-color: #00cc00;
			box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
			backdrop-filter: blur(5px);
			font-size: 18px;
			font-weight: bold;
			color: #ffffff;
			cursor: pointer;
		  }
		  p {
			color: #333333;
			font-size: 13px;
			display: block;
			margin: 10px 0;
		  }
		</style>
	  </head>
	  <body>
		<div class="container" style="background-color: #f2f2f2; padding: 20px;">
		  <h2>Dear ${recipientName},</h2>
		  <p>Thank you for topping up your TheraWallet with TheraSwift.</p>
		  <p>Payment of NGN ${topupAmount} has been successfully processed through Paystack, with the transaction reference:</p>
		  <div class="success">${transactionReference}</div>
		  <p class="details">Please allow up to 5 minutes for the transaction to be reflected in your TheraWallet balance.</p>
		  <p>If you have any questions or concerns, please contact us at support@theraswift.com.</p>
		  <p>Thank you for choosing TheraSwift.</p>
		  <p>Best regards,</p>
		  <p>TheraSwift Team</p>
		</div>
	  </body>
	</html>
  `;
exports.walletTopupEmailTemplate = walletTopupEmailTemplate;
const passwordRecoveryMailTemplate = (otp, firstName) => `
  <html>
    <head>
      <style>
      @import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@300;400&family=Nunito:wght@200;300;400;500;600&display=swap');
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
          font-family: 'Inconsolata', monospace;
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
      <p style="color: #333333;">We have received a request to reset your password.</p>
      <p style="color: #333333;">Please use the following OTP to reset your password:</p>
        <div class="otp">${otp}</div>
        <p>This OTP will expire in ${utils_1.OTP_EXPIRY_TIME / (60 * 1000)} minutes.</p>
        <p>If you did not request this code, please ignore this email.</p>
        <p style="color: #333333;">Thank you for choosing TheraSwift.</p>
        <p style="color: #333333;">Best regards,</p>
        <p style="color: #333333;">Theraswift Team</p>
      </div>
    </body>
  </html>
`;
exports.passwordRecoveryMailTemplate = passwordRecoveryMailTemplate;
const orderStatusTemplate = (firstName, orderStatus) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>TheraSwift Order Status Update</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.4;
        color: #444444;
      }

      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
      }

      h1 {
        font-size: 24px;
        font-weight: bold;
        color: #005b9a;
        margin-top: 0;
        margin-bottom: 20px;
      }

      p {
        margin-top: 0;
        margin-bottom: 20px;
      }

      .status {
        font-size: 18px;
        font-weight: bold;
        color: #005b9a;
        text-transform: capitalize;
      }

      .button {
        display: inline-block;
        background-color: #005b9a;
        color: #ffffff;
        padding: 10px 20px;
        border-radius: 5px;
        text-decoration: none;
      }

      .button:hover {
        background-color: #003d6b;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>TheraSwift Order Status Update</h1>
      <p>Hello ${firstName},</p>
      <p>Your order has been updated to <span class="status">${orderStatus}</span> status.</p>
      <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
      <p>Thank you for choosing TheraSwift!</p>
      <p>Sincerely,</p>
      <p>The TheraSwift Team</p>
      <br>
      <p>
        <a href="#" class="button">View Order Details</a>
      </p>
    </div>
  </body>
</html>
`;
exports.orderStatusTemplate = orderStatusTemplate;
const orderCompleteEmailTemplate = (orderId, deliveryDate) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Complete Notification</title>
    <style>
      /* Reset styles */
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      /* Email styles */
      body {
        background-color: #f4f4f4;
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.4;
        color: #444444;
        padding: 20px;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        padding: 20px;
      }

      h1 {
        font-size: 24px;
        margin-bottom: 20px;
        text-align: center;
        color: #0077c0;
      }

      p {
        margin-bottom: 20px;
      }

      .order-details {
        margin-bottom: 20px;
        padding: 20px;
        background-color: #f8f8f8;
        border-radius: 5px;
      }

      .order-details h2 {
        font-size: 20px;
        margin-bottom: 10px;
        color: #444444;
      }

      .order-details p {
        margin-bottom: 5px;
      }

      .delivery-details {
        margin-bottom: 20px;
        padding: 20px;
        background-color: #f8f8f8;
        border-radius: 5px;
      }

      .delivery-details h2 {
        font-size: 20px;
        margin-bottom: 10px;
        color: #444444;
      }

      .delivery-details p {
        margin-bottom: 5px;
      }

      /* Button styles */
      .btn {
        display: inline-block;
        background-color: #0077c0;
        color: #ffffff;
        font-size: 16px;
        font-weight: bold;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        border-radius: 5px;
        transition: background-color 0.3s ease;
      }

      .btn:hover {
        background-color: #00538b;
      }

      /* Utility classes */
      .text-center {
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Order Complete Notification</h1>
      <p>Dear Admin,</p>
      <p>We are pleased to inform you that order #${orderId} has been completed and is ready for delivery.</p>
      <div class="order-details">
        <h2>Order Details</h2>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Order Status:</strong>Complete</p>
      </div>
      <div class="delivery-details">
        <h2>Delivery Details</h2>
        <p><strong>Delivery Date:</strong>
        </p>
        <p>${deliveryDate}</p>
      </div>
      <p>Thank you for choosing Theraswift!</p>
      <p>Sincerely,</p>
      <p>The Theraswift Team</p>
    </div>
  </body>
</html>
`;
exports.orderCompleteEmailTemplate = orderCompleteEmailTemplate;
