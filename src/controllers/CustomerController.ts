import { plainToClass } from "class-transformer";
import { CreateCustomerInputs, CustomerLginInputs, EditCustomerInputs } from "../dto";
import { Request, Response, Router } from "express";
import { validate } from "class-validator";
import {
  encryptPassword,
  generateOTP,
  generateSalt,
  generateToken,
  onRequestOTP,
  validatePassword,
} from "../utils";
import Customer from "../models/Customer";

export const customerSignup = async (req: Request, res: Response) => {
  const inputs = plainToClass(CreateCustomerInputs, req.body);
  const errors = await validate(inputs, { validationError: { target: false } });
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

export const customerSignin = async (req: Request, res: Response) => {
  const loginInputs = plainToClass(CustomerLginInputs, req.body);
  const errors = await validate(loginInputs, { validationError: { target: false } });
  if (errors.length > 0) return res.status(400).json(errors);

  const { email, password } = loginInputs;

  const customer = await Customer.findOne({ email });
  if (!customer) return res.status(400).json({ msg: "Invalid email or password" });

  const isValid = await validatePassword(password, customer.password, customer.salt);
  if (!isValid) return res.status(400).json({ msg: "Invalid email or password" });

  const token = generateToken({
    _id: customer._id.toString(),
    email: customer.email,
    isVerified: customer.isVeified,
  });

  return res.json({ token, isVerified: customer.isVeified, email: customer.email });
};

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

export const requestOTP = async (req: Request, res: Response) => {
  const customer = req.user;
  if (!customer) return res.status(401).json({ msg: "Unauthorized" });

  const profile = await Customer.findById(customer._id);
  if (!profile) return res.status(404).json({ msg: "Customer not found" });

  const { otp, otpExpires } = generateOTP();
  profile.otp = otp;
  profile.otpExpires = otpExpires;
  await profile.save();

  await onRequestOTP(otp, profile.phone);

  return res.json({ msg: "OTP sent" });
};

export const getCustomerProfile = async (req: Request, res: Response) => {
  const customer = req.user;
  if (!customer) return res.status(401).json({ msg: "Unauthorized" });

  const profile = await Customer.findById(customer._id);
  if (!profile) return res.status(404).json({ msg: "Customer not found" });

  return res.json({ data: profile });
};

export const editCustomerProfile = async (req: Request, res: Response) => {
  const profileInputs = plainToClass(EditCustomerInputs, req.body);
  const errors = await validate(profileInputs, { validationError: { target: false } });
  if (errors.length > 0) return res.status(400).json(errors);

  const customer = req.user;
  if (!customer) return res.status(401).json({ msg: "Unauthorized" });

  const profile = await Customer.findById(customer._id);
  if (!profile) return res.status(404).json({ msg: "Customer not found" });

  const { firstName, lastName, address } = profileInputs;

  if (firstName) profile.firstName = firstName;
  if (lastName) profile.lastName = lastName;
  if (address) profile.address = address;

  const result = await profile.save();

  return res.json({ data: result, msg: "Profile updated" });
};
