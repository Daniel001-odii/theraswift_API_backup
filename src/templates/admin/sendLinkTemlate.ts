
export const htmlMailLinkTemplate = (name: string, link: string) => `
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
      
      <p style="color: #333333;">Hi ${name}, Theraswift here. Your medication are ready</p>
      <p style="color: #333333;">You can view your medication and schedule your delivery here.</p>
      <a href="${link}">${link}</a>
        
        <p>Text or call for help anytime.</p>
        <p style="color: #333333;">Thank you for choosing TheraSwift.</p>
        <p style="color: #333333;">Best regards,</p>
        <p style="color: #333333;">Theraswift Team</p>
      </div>
    </body>
  </html>
`;