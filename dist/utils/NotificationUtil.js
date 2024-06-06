"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRequestOTP = exports.generateOTP = void 0;
const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    let otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 5);
    return { otp, otpExpires };
};
exports.generateOTP = generateOTP;
const onRequestOTP = (otp, phone) => __awaiter(void 0, void 0, void 0, function* () {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken);
    try {
        yield client.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone,
        });
    }
    catch (error) {
        console.error(error);
    }
});
exports.onRequestOTP = onRequestOTP;
//# sourceMappingURL=NotificationUtil.js.map