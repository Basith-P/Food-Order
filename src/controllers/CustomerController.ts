import { plainToClass } from "class-transformer";
import { CreateCustomerInputs } from "../dto";
import { Request, Response, Router } from "express";
import { validate } from "class-validator";
import {
  encryptPassword,
  generateOTP,
  generateSalt,
  generateToken,
  onRequestOTP,
} from "../utils";
import Customer from "../models/Customer";

export const customerSignup = async (req: Request, res: Response) => {
  const inputs = plainToClass(CreateCustomerInputs, req.body);
  const errors = await validate(inputs, { validationError: { target: true } });
  if (errors.length > 0) return res.status(400).json(errors);

  const { email, password, phone } = inputs;

  const customer = await Customer.findOne({ email });
  if (customer) return res.status(400).json({ msg: "Email already exists" });

  const salt = await generateSalt();
  const passwordHash = await encryptPassword(password, salt);

  const { otp, otpExpires } = generateOTP();

  const result = await Customer.create({
    email,
    password: passwordHash,
    phone,
    salt,
    otp,
    otpExpires,
    firstName: "",
    lastName: "",
  });

  if (!result) return res.status(500).json({ msg: "Failed to create customer" });

  await onRequestOTP(otp, phone);

  const token = generateToken({
    _id: result._id.toString(),
    email: result.email,
    isVerified: result.isVeified,
  });

  return res.json({ token, isVerified: result.isVeified, email: result.email });
};

export const customerSignin = async (req: Request, res: Response) => {};

export const customerVerify = async (req: Request, res: Response) => {
  const { otp } = req.body;
  const customer = req.user;

  if (!customer) return res.status(401).json({ msg: "Unauthorized" });

  const profile = await Customer.findById(customer._id);
  if (!profile) return res.status(404).json({ msg: "Customer not found" });

  if (profile.otp !== parseInt(otp)) return res.status(400).json({ msg: "Invalid OTP" });
  if (profile.otpExpires < new Date())
    return res.status(400).json({ msg: "OTP expired" });

  profile.isVeified = true;
  await profile.save();

  return res.json({ msg: "Customer verified" });
};
