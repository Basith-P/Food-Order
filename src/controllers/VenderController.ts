import { Request, Response, NextFunction } from "express";
import { findVender } from "./AdminController";
import { generateToken, validatePassword } from "../utils/PasswordUtility";
import { EditVendorInputs } from "dto";

export const venderLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const vendor = await findVender("", email);
  if (vendor == null)
    return res.status(401).json({ msg: "Vender with this email does not exist" });

  const isValid = await validatePassword(password, vendor.password, vendor.salt);

  if (!isValid) return res.status(401).json({ msg: "Invalid password" });

  const token = generateToken({
    _id: vendor.id,
    name: vendor.name,
    email: vendor.email,
    foodType: vendor.foodType,
  });

  // if (token == null) return res.status(500).json({ msg: "Something went wrong!" });

  return res.json({ token });
};

export const getVenderProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const vendor = await findVender(user._id);
  if (vendor == null) return res.status(404).json({ msg: "Vendor not found" });

  return res.json({ data: vendor });
};

export const updateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const vendor = await findVender(user._id);
  if (vendor == null) return res.status(404).json({ msg: "Vendor not found" });

  const { address, phone, foodType, name } = <EditVendorInputs>req.body;

  if (address) vendor.address = address;
  if (phone) vendor.phone = phone;
  if (foodType) vendor.foodType = foodType;
  if (name) vendor.name = name;

  const result = await vendor.save();
  return res.json({ data: result, msg: "Profile updated" });
};
