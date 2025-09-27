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

const getNotificationTemplate = (notificationData) => {
  const {
    username,
    title,
    description,
    priority = "medium",
    type,
    transactionId = null,
    timestamp = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  } = notificationData;

  // Priority color mapping
  const priorityColors = {
    high: "#dc2626",
    medium: "#ea580c",
    low: "#16a34a",
  };

  // Type icon mapping
  const typeIcons = {
    orders: "📦",
    systems: "⚙️",
    promotions: "🎁",
    vendor: "🏪",
    "price alerts": "💰",
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notification - LPX Collect</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body {
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
            font-family: 'Inter', sans-serif;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .header {
            background: linear-gradient(135deg, #1A202C 0%, #2D3748 100%);
            padding: 24px 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .header .left {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .header .icon {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }
        .header .title {
            color: #ffffff;
            font-size: 20px;
            font-weight: 600;
            margin: 0;
        }
        .header .timestamp {
            text-align: right;
            color: #e2e8f0;
            font-size: 12px;
            opacity: 0.8;
        }
        .content {
            padding: 30px;
        }
        .greeting {
            margin-bottom: 24px;
        }
        .greeting p {
            color: #718096;
            font-size: 14px;
            margin: 0;
        }
        .notification-card {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 0;
            overflow: hidden;
        }
        .notification-header {
            background-color: #f7fafc;
            padding: 16px 20px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .notification-header .type {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .notification-header .type span {
            font-size: 18px;
        }
        .notification-header .priority {
            background-color: ${priorityColors[priority]};
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            text-transform: capitalize;
        }
        .notification-body {
            padding: 24px 20px;
        }
        .notification-body h3 {
            color: #1A202C;
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 12px 0;
        }
        .notification-body p {
            color: #4a5568;
            font-size: 14px;
            line-height: 1.6;
            margin: 0;
        }
        .action-buttons {
            margin-top: 24px;
            text-align: center;
        }
        .action-buttons a {
            display: inline-block;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            font-size: 14px;
            margin-right: 12px;
        }
        .action-buttons .primary {
            background: linear-gradient(135deg, #1A202C 0%, #2D3748 100%);
            color: white;
        }
        .action-buttons .secondary {
            background-color: #f1f5f9;
            color: #475569;
            border: 1px solid #e2e8f0;
        }
        .footer-note {
            margin-top: 24px;
            padding: 16px;
            background-color: #fefce8;
            border-radius: 6px;
            border-left: 4px solid #f59e0b;
        }
        .footer-note p {
            color: #92400e;
            font-size: 12px;
            margin: 0;
            line-height: 1.4;
        }
        .footer {
            background-color: #f8fafc;
            padding: 24px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            color: #718096;
            font-size: 14px;
            margin: 0 0 8px 0;
        }
        .footer a {
            color: #a0aec0;
            text-decoration: none;
        }

        /* Media Queries for Responsiveness */
        @media (max-width: 600px) {
            .container {
                padding: 10px;
                margin: 10px;
            }
            .header {
                padding: 16px 20px;
            }
            .content {
                padding: 20px;
            }
            .notification-body h3 {
                font-size: 16px;
            }
            .notification-body p {
                font-size: 13px;
            }
            .action-buttons a {
                padding: 10px 18px;
                font-size: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="left">
                <div class="icon">🔔</div>
                <div>
                    <div class="title">New Notification</div>
                    <div class="timestamp">${timestamp}</div>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                <p>Hello <strong>${username}</strong>,</p>
                <p>You have a new notification from LPX Collect.</p>
            </div>

            <!-- Notification Card -->
            <div class="notification-card">
                <div class="notification-header">
                    <div class="type">
                        <span>${typeIcons[type] || "📋"}</span>
                        <div>
                            <span style="background-color: #${
                              type === "orders"
                                ? "dbeafe"
                                : type === "systems"
                                ? "fef3c7"
                                : type === "promotions"
                                ? "fce7f3"
                                : type === "vendor"
                                ? "dcfce7"
                                : "f3e8ff"
                            }; color: #${
    type === "orders"
      ? "1e40af"
      : type === "systems"
      ? "92400e"
      : type === "promotions"
      ? "be185d"
      : type === "vendor"
      ? "166534"
      : "7c3aed"
  }; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: capitalize;">
                                ${type}
                            </span>
                            <span class="priority">${priority}</span>
                        </div>
                    </div>
                    ${
                      transactionId
                        ? `
                    <div style="text-align: right;">
                        <span style="color: #718096; font-size: 12px;">Transaction ID:</span>
                        <p style="color: #4a5568; font-size: 12px; font-weight: 500;">${transactionId}</p>
                    </div>`
                        : ""
                    }
                </div>

                <!-- Body -->
                <div class="notification-body">
                    <h3>${title}</h3>
                    <p>${description}</p>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
                <a href="https://lpxcollect.com/account/notifications" class="secondary">Manage Notifications</a>
            </div>

            <!-- Footer Note -->
            <div class="footer-note">
                <p>💡 <strong>Tip:</strong> You can manage your notification preferences in your account settings.</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>This notification was sent by <strong>LPX Collect</strong></p>
            <p>© 2025 LPX Collect. All rights reserved. <a href="#">Unsubscribe</a> • <a href="#">Privacy Policy</a> • <a href="#">Help Center</a></p>
        </div>
    </div>
</body>
</html>`;
};

// Enhanced send function with better error handling
const sendNotificationEmail = async (to, notificationData) => {
  try {
    const subject = `🔔 ${notificationData.title} - LPX Collect`;
    const html = getNotificationTemplate(notificationData);

    const msg = {
      from: config.email.from,
      to,
      subject,
      html,
    };

    await transport.sendMail(msg);
    console.log(`Notification sent successfully to: ${to}`);
  } catch (error) {
    console.error("Error sending notification email:", error);
    throw error;
  }
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendEmailVerification,
  sendWelcomeEmail,
  sendNotificationEmail,
};
