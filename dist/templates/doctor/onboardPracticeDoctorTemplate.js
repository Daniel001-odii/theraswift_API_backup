"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.practiceDoctorVerificationEmail = void 0;
const practiceDoctorVerificationEmail = (firstName, doctor_id) => `
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
        p{
            color: #333333;
            font-size: 13px;
            display: block
        }
        .link{
            color: blue;
            display: block;
        }

      </style>
    </head>
    <body>
      <div class="container" style="background-color: #f2f2f2; padding: 20px;display:block">
      <h2 style="color: #333333;text-transform:capitalize">Dear ${firstName},</h2>
      <p style="color: #333333;">A doctor you share a clinic code with has added you as a practice member, hence a new account has been created for you.</p>
      <p style="color: #333333;">Please use the following link to verify your account and setup a password for your account:</p>
        <a class="link" href='https://providers.theraswift.co/invite/new_practice_member/auth?doctor_id=${doctor_id}' >Verify Now</a>
        <p>If you did not request this onboarding, please ignore this email.</p>
        <p style="color: #333333;">Thank you for choosing TheraSwift.</p>
        <p style="color: #333333;">Best regards,</p>
        <p style="color: #333333;">Theraswift Team</p>
      </div>
    </body>
  </html>
`;
exports.practiceDoctorVerificationEmail = practiceDoctorVerificationEmail;
