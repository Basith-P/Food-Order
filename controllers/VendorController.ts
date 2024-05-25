import { Request, Response, NextFunction } from "express";
import { findVendor } from "./AdminController";
import { validatePassword } from "../utils/PasswordUtility";

export const vendorLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const vendor = await findVendor("", email);
  if (vendor == null)
    return res.status(401).json({ msg: "Vendor with this email does not exist" });

  const isValid = await validatePassword(password, vendor.password, vendor.salt);

  if (!isValid) return res.status(401).json({ msg: "Invalid password" });

  return res.json(vendor);
};
