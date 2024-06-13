import { plainToClass } from "class-transformer";
import { Request, Response } from "express";
import { CreateDeliveryUserInputs } from "../dto/DeliveryUser.dto";
import { validate } from "class-validator";
import {
  CreateCustomerInputs,
  CustomerLginInputs,
  EditCustomerInputs,
} from "../dto";
import { genSalt } from "bcrypt";
import { encryptPassword, generateToken, validatePassword } from "../utils";
import DeliveryUser from "../models/DeliveryUser";

export const deliveryUserSignUp = async (req: Request, res: Response) => {
  const inputs = plainToClass(CreateCustomerInputs, req.body);
  const errors = await validate(inputs, { validationError: { target: false } });
  if (errors.length > 0) return res.status(400).json(errors);

  const { email, password, phone, address, firstName, lastName, pincode } = <
    CreateDeliveryUserInputs
  >inputs;

  const user = await DeliveryUser.findOne({ email });
  if (user) return res.status(400).json({ message: "User already exists" });

  const salt = await genSalt(10);
  const hashedPassword = await encryptPassword(password, salt);

  const result = await DeliveryUser.create({
    email,
    password: hashedPassword,
    phone,
    address,
    pincode,
    firstName,
    lastName,
    salt,
  });

  if (!result) return res.status(500).json({ msg: "Failed to create user" });

  const token = generateToken({
    _id: result.id.toString(),
    email: result.email,
    isVerified: result.isVeified,
  });

  return res.json({ token, isVerified: result.isVeified, email: result.email });
};

export const deliveryUserLogin = async (req: Request, res: Response) => {
  const loginInputs = plainToClass(CustomerLginInputs, req.body);
  const errors = await validate(loginInputs, {
    validationError: { target: false },
  });
  if (errors.length > 0) return res.status(400).json(errors);

  const { email, password } = loginInputs;

  const user = await DeliveryUser.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isValid = await validatePassword(password, user.password, user.salt);
  if (!isValid)
    return res.status(400).json({ msg: "Invalid email or password" });

  const token = generateToken({
    _id: user.id.toString(),
    email: user.email,
    isVerified: user.isVeified,
  });

  return res.json({
    token,
    isVerified: user.isVeified,
    email: user.email,
  });
};

export const getDeliveryUserProfile = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const profile = await DeliveryUser.findById(user._id);
  if (!profile) return res.status(404).json({ msg: "User not found" });

  return res.json({ data: profile });
};

export const updateDeliveryUserProfile = async (
  req: Request,
  res: Response
) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const inputs = plainToClass(EditCustomerInputs, req.body);
  const errors = await validate(inputs, { validationError: { target: false } });
  if (errors.length > 0) return res.status(400).json(errors);

  const { firstName, lastName, address } = inputs;

  const profile = await DeliveryUser.findByIdAndUpdate(
    user._id,
    { firstName, lastName, address },
    { new: true }
  );
  if (!profile) return res.status(404).json({ msg: "User not found" });

  return res.json({ data: profile });
};

export const changeDeliveryStatus = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const { isAvailable, lat, lng } = req.body;

  const result = await DeliveryUser.findByIdAndUpdate(
    user._id,
    { isAvailable, lat, lng },
    { new: true }
  );

  if (!result) return res.status(404).json({ msg: "Error updating status" });

  return res.json({ data: result });
};
