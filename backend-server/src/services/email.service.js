const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("../config/logger");

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch((err) =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
}

// Common email styles for consistency
const getEmailTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LPX Collect</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1A202C 0%, #2D3748 100%); padding: 40px 30px; text-align: center;">
            <img src="https://i.ibb.co.com/MxBVxR0c/package.png" alt="LPX Collect" style="max-width: 120px; height: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;">
            <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">LPX Collect</h1>
            <p style="color: #e2e8f0; font-size: 16px; margin: 8px 0 0 0; opacity: 0.9;">Professional Collection Services</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            ${content}
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; font-size: 14px; margin: 0 0 10px 0;">
                This email was sent by <strong style="color: #1A202C;">LPX Collect</strong>
            </p>
            <p style="color: #a0aec0; font-size: 12px; margin: 0;">
                © 2025 LPX Collect. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>`;

const sendEmail = async (to, subject, html) => {
  const msg = { from: config.email.from, to, subject, html };
  await transport.sendMail(msg);
};

const sendEmailVerification = async (to, otp) => {
  console.log("Email verification sent to:", to);
  const subject = "Verify Your LPX Collect Account";

  const content = `
    <div style="text-align: center;">
        <h2 style="color: #1A202C; font-size: 24px; font-weight: 600; margin-bottom: 20px;">
            Welcome to LPX Collect!
        </h2>
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Thank you for joining our professional collection services platform. To complete your account setup, please use the verification code below.
        </p>
        
        <div style="background: linear-gradient(135deg, #1A202C 0%, #2D3748 100%); color: #fff; padding: 25px 30px; border-radius: 8px; font-size: 32px; font-weight: 800; letter-spacing: 3px; margin: 30px 0; display: inline-block; min-width: 200px;">
            ${otp}
        </div>
        
        <p style="color: #4a5568; font-size: 14px; margin-bottom: 20px;">
            Enter this 6-digit code to verify your account and get started.
        </p>
        
        <div style="background-color: #fed7d7; border: 1px solid #feb2b2; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="color: #c53030; font-size: 14px; margin: 0; font-weight: 500;">
                ⏰ This verification code expires in 3 minutes for your security.
            </p>
        </div>
        
        <p style="color: #718096; font-size: 14px; line-height: 1.5; margin-top: 30px;">
            If you didn't create this account, you can safely ignore this email.
        </p>
    </div>`;

  const html = getEmailTemplate(content);
  await sendEmail(to, subject, html);
};

const sendResetPasswordEmail = async (to, otp) => {
  console.log("Password reset email sent to:", to);
  const subject = "Reset Your LPX Collect Password";

  const content = `
    <div style="text-align: center;">
        <div style="background-color: #fef5e7; border-radius: 50px; width: 80px; height: 80px; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 36px;">🔒</span>
        </div>
        
        <h2 style="color: #1A202C; font-size: 24px; font-weight: 600; margin-bottom: 20px;">
            Password Reset Request
        </h2>
        
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            We received a request to reset the password for your LPX Collect account. Use the secure code below to create a new password.
        </p>
        
        <div style="background: linear-gradient(135deg, #1A202C 0%, #2D3748 100%); color: #ffffff; padding: 25px 30px; border-radius: 8px; font-size: 32px; font-weight: 800; letter-spacing: 3px; margin: 30px 0; display: inline-block; min-width: 200px;">
            ${otp}
        </div>
        
        <p style="color: #4a5568; font-size: 14px; margin-bottom: 20px;">
            Enter this code on the password reset page to continue.
        </p>
        
        <div style="background-color: #fed7d7; border: 1px solid #feb2b2; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="color: #c53030; font-size: 14px; margin: 0; font-weight: 500;">
                ⏰ This reset code expires in 3 minutes for your security.
            </p>
        </div>
        
        <div style="background-color: #e6fffa; border: 1px solid #81e6d9; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="color: #234e52; font-size: 14px; margin: 0;">
                <strong>Security Note:</strong> If you didn't request this password reset, please contact our support team immediately.
            </p>
        </div>
    </div>`;

  const html = getEmailTemplate(content);
  await sendEmail(to, subject, html);
};

const sendVerificationEmail = async (to, token) => {
  console.log("Account verification email sent to:", to);
  const subject = "Complete Your LPX Collect Account Verification";

  // Replace this URL with your actual front-end verification page
  const verificationEmailUrl = `${config.clientUrl}/verify-email?token=${token}`;

  const content = `
    <div style="text-align: center;">
        <div style="background-color: #e6fffa; border-radius: 50px; width: 80px; height: 80px; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 36px;">✉️</span>
        </div>
        
        <h2 style="color: #1A202C; font-size: 24px; font-weight: 600; margin-bottom: 20px;">
            Verify Your Email Address
        </h2>
        
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Welcome to LPX Collect! Please verify your email address to activate your account and access all our professional collection services.
        </p>
        
        <div style="margin: 30px 0;">
            <a href="${verificationEmailUrl}" 
               style="background: linear-gradient(135deg, #1A202C 0%, #2D3748 100%); color: #ffffff; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; transition: all 0.3s ease;">
                Verify Email Address
            </a>
        </div>
        
        <p style="color: #718096; font-size: 14px; line-height: 1.5; margin: 20px 0;">
            Or copy and paste this link into your browser:
        </p>
        <p style="background-color: #f7fafc; padding: 10px; border-radius: 4px; color: #2d3748; font-size: 12px; word-break: break-all; border: 1px solid #e2e8f0;">
            ${verificationEmailUrl}
        </p>
        
        <div style="background-color: #fef5e7; border: 1px solid #f6d8a7; border-radius: 6px; padding: 15px; margin: 25px 0;">
            <p style="color: #744210; font-size: 14px; margin: 0;">
                <strong>Important:</strong> If you didn't create an account with LPX Collect, please ignore this email.
            </p>
        </div>
    </div>`;

  const html = getEmailTemplate(content);
  await sendEmail(to, subject, html);
};

const sendWelcomeEmail = async (to, userName) => {
  console.log("Welcome email sent to:", to);
  const subject = "Welcome to LPX Collect - Your Account is Ready!";

  const content = `
    <div style="text-align: center;">
        <div style="background-color: #e6fffa; border-radius: 50px; width: 80px; height: 80px; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 36px;">🎉</span>
        </div>
        
        <h2 style="color: #1A202C; font-size: 24px; font-weight: 600; margin-bottom: 20px;">
            Welcome to LPX Collect!
        </h2>
        
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Hello ${
              userName || "valued client"
            }, your account has been successfully verified and is now active. You can now access all our professional collection services.
        </p>
        
        <div style="text-align: left; max-width: 400px; margin: 30px auto;">
            <h3 style="color: #1A202C; font-size: 18px; margin-bottom: 15px;">What's Next?</h3>
            <ul style="color: #4a5568; font-size: 14px; line-height: 1.6; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Explore our dashboard and services</li>
                <li style="margin-bottom: 8px;">Set up your collection preferences</li>
                <li style="margin-bottom: 8px;">Contact our support team if you need assistance</li>
            </ul>
        </div>
        
        <div style="margin: 30px 0;">
            <a href="${config.clientUrl}/dashboard" 
               style="background: linear-gradient(135deg, #1A202C 0%, #2D3748 100%); color: #ffffff; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
                Access Your Dashboard
            </a>
        </div>
    </div>`;

  const html = getEmailTemplate(content);
  await sendEmail(to, subject, html);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendEmailVerification,
  sendWelcomeEmail,
};

// const nodemailer = require("nodemailer");
// const config = require("../config/config");
// const logger = require("../config/logger");

// const transport = nodemailer.createTransport(config.email.smtp);
// /* istanbul ignore next */
// if (config.env !== "test") {
//   transport
//     .verify()
//     .then(() => logger.info("Connected to email server"))
//     .catch((err) =>
//       logger.warn(
//         "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
//       )
//     );
// }

// const sendEmail = async (to, subject, html) => {
//   const msg = { from: config.email.from, to, subject, html };
//   await transport.sendMail(msg);
// };

// const sendEmailVerification = async (to, otp) => {
//   console.log("sendEmailVerification", to, otp);
//   const subject = "User verification code";
//   const html = `
//   <body style="background-color: #f3f4f6; padding: 2rem; font-family: Arial, sans-serif; color: #333;">
//     <div
//         style="max-width: 32rem; margin: 0 auto; background-color: #ffffff; padding: 2rem; border-radius: 0.75rem; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); text-align: center;">
//         <img src="https://raw.githubusercontent.com/shadat-hossan/Image-server/refs/heads/main/NEXMOTAG.jpeg"
//             alt="NEXMO TAG" style="max-width: 10rem; margin-bottom: 1.5rem;">
//         <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem; color: #1f2937;">Welcome to NEXMO TAG
//         </h1>
//         <p style="color: #4b5563; margin-bottom: 1.5rem;">Thank you for joining NEXMO TAG! Your account is almost
//             ready.</p>
//         <div
//             style="background: linear-gradient(135deg, #3b82f6, #06b6d4); color: #ffffff; padding: 1rem; border-radius: 0.5rem; font-size: 2rem; font-weight: 800; letter-spacing: 0.1rem; margin-bottom: 1.5rem;">
//             ${otp}
//         </div>
//         <p style="color: #4b5563; margin-bottom: 1.5rem;">Collect this code to verify your account.</p>
//         <p style="color: #ff0000; font-size: 0.85rem; margin-top: 1.5rem;">This code expires in <span
//                 id="timer">3:00</span>
//             minutes.</p>
//         <a href="https://shadat-hossain.netlify.app" style="color: #888; font-size: 12px; text-decoration: none;"
//             target="_blank">ᯤ
//             Develop by ᯤ</a>
//     </div>
// `;
//   await sendEmail(to, subject, html);
// };

// const sendResetPasswordEmail = async (to, otp) => {
//   console.log("Password Reset Email", to, otp);
//   const subject = "Password Reset Email";
//   const html = `
//       <body style="background-color: #f3f4f6; padding: 2rem; font-family: Arial, sans-serif; color: #333;">
//           <div
//               style="max-width: 32rem; margin: 0 auto; background-color: #ffffff; padding: 2rem; border-radius: 0.75rem; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); text-align: center;">
//               <img src="https://raw.githubusercontent.com/shadat-hossan/Image-server/refs/heads/main/NEXMOTAG.jpeg"
//                   alt="NEXMO-TAG" style="max-width: 8rem; margin-bottom: 1.5rem;">
//               <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem; color: #1f2937;">Password Reset Request
//               </h1>
//               <p style="color: #4b5563; margin-bottom: 1.5rem;">You requested a password reset for your account. Use the code
//                   below to reset your password:</p>
//               <div
//                   style="background: linear-gradient(135deg, #3d56ad, #0032D3); color: #ffffff; padding: 1rem; border-radius: 0.5rem; font-size: 2rem; font-weight: 800; letter-spacing: 0.1rem; margin-bottom: 1.5rem;">
//                   ${otp}
//               </div>
//               <p style="color: #d6471c; margin-bottom: 1.5rem;">Collect this code to reset your password. This code is valid
//                   for
//                   3
//                   minutes.</p>
//               <p style="color: #6b7280; font-size: 0.875rem; margin-top: 1.5rem;">If you did not request a password reset,
//                   please ignore this email.</p>
//               <a href="https://shadat-hossain.netlify.app" style="color: #888; font-size: 12px; text-decoration: none;"
//                   target="_blank">ᯤ
//                   Develop by ᯤ</a>
//           </div>
//       </body>
// `;
//   await sendEmail(to, subject, html);
// };

// const sendVerificationEmail = async (to, token) => {
//   const subject = "Email Verification";
//   // replace this url with the link to the email verification page of your front-end app
//   const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
//   const text = `Dear user,
// To verify your email, click on this link: ${verificationEmailUrl}
// If you did not create an account, then ignore this email.`;
//   await sendEmail(to, subject, text);
// };

// module.exports = {
//   transport,
//   sendEmail,
//   sendResetPasswordEmail,
//   sendVerificationEmail,
//   sendEmailVerification,
// };
