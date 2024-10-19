import nodemailer from "nodemailer";
import { config } from "../config/config";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail", // Using Gmail service
    auth: {
      user: config.email.user,
      pass: config.email.pass, // This should be your App Password, not your regular Gmail password
    },
  });
};

export const sendVerificationEmail = async (
  to: string,
  otp: string
): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"Job Board" <${config.email.user}>`,
      to: to,
      subject: "Verify Your Email - Job Board",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to Job Board!</h2>
          <p>Thank you for registering. Your OTP for verification is:</p>
          <h1 style="font-size: 24px; color: #4CAF50;">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
        </div>
      `,
    });

    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};

export const sendJobAlert = async (
  to: string[],
  jobDetails: any
): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    // Verify transporter configuration
    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"Job Board" <${config.email.user}>`,
      to: to.join(", "),
      subject: `New Job Opportunity: ${jobDetails.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New Job Opportunity: ${jobDetails.title}</h2>
          <p>${jobDetails.description}</p>
          <p><strong>Experience Level:</strong> ${jobDetails.experienceLevel}</p>
          <p><strong>Application Deadline:</strong> ${jobDetails.endDate}</p>
          <a href="http://localhost:3000/jobs/${jobDetails.id}" 
             style="background-color: #4CAF50; color: white; padding: 14px 20px; 
                    text-align: center; text-decoration: none; display: inline-block; 
                    border-radius: 4px; margin: 10px 0;">
            View Job Details
          </a>
        </div>
      `,
    });

    console.log("Job alert email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending job alert email:", error);
    return false;
  }
};
