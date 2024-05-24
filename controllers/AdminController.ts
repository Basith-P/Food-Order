import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";

import Vendor from "../models/Vendor";
import { encryptPassword, generateSalt } from "../utils/PasswordUtility";

export const createVendor = async (req: Request, res: Response, next: NextFunction) => {
  const { name, address, pincode, email, phone, ownerName, password, foodType } = <
    CreateVendorInput
  >req.body;

  const existingVendor = await Vendor.findOne({ email });
  if (existingVendor != null)
    return res.status(401).json({ msg: "Vendor with email already exists" });

  const salt = await generateSalt();
  const passwd = await encryptPassword(password, salt);

  const createVendorRes = await Vendor.create({
    name: name,
    address: address,
    pincode: pincode,
    email: email,
    phone: phone,
    ownerName: ownerName,
    password: passwd,
    foodType: foodType,
    rating: 0,
    coverImages: [],
    salt: salt,
    isServiceAvailable: false,
  });

  return res.json(createVendorRes);
};

export const getVendors = async (req: Request, res: Response, next: NextFunction) => {
  const vendors = await Vendor.find();
  return res.json({ data: vendors });
};
export const getVendorById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const vendor = await Vendor.findById(id);
  return res.json({ data: vendor });
};
