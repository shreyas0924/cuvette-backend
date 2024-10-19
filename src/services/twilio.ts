import twilio, { Twilio } from "twilio";
import { config } from "../config/config";

// Create Twilio client instance
const createTwilioClient = (): Twilio => {
  return twilio(config.twilio.accountSid, config.twilio.authToken);
};

export const sendOTPVerification = async (
  to: string,
  otp: string
): Promise<boolean> => {
  try {
    const client = createTwilioClient();
    
    const message = await client.messages.create({
      body: `Your Job Board verification code is: ${otp}. This code will expire in 10 minutes.`,
      from: config.twilio.phoneNumber,
      to: to
    });

    console.log('OTP SMS sent:', message.sid);
    return true;
  } catch (error) {
    console.error('Error sending OTP SMS:', error);
    return false;
  }
};