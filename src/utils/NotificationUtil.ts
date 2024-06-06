export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  let otpExpires = new Date();
  otpExpires.setMinutes(otpExpires.getMinutes() + 5);
  return { otp, otpExpires };
};

export const onRequestOTP = async (otp: number, phone: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  const client = require("twilio")(accountSid, authToken);

  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
  } catch (error) {
    console.error(error);
  }
};
