import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";

import Vendor from "../models/Vendor";

export const createVendor = async (req: Request, res: Response, next: NextFunction) => {
  const { name, address, pincode, email, phone, ownerName, password, foodType } = <
    CreateVendorInput
  >req.body;

  const existingVendor = await Vendor.findOne({ email });
  if (existingVendor != null)
    return res.status(401).json({ msg: "Vendor with email already exists" });

  const createVendorRes = await Vendor.create({
    name: name,
    address: address,
    pincode: pincode,
    email: email,
    phone: phone,
    ownerName: ownerName,
    password: password,
    foodType: foodType,
    rating: 0,
    coverImages: [],
    salt: "af123",
    isServiceAvailable: false,
  });

  return res.json(createVendorRes);
};

export const getVendors = (req: Request, res: Response, next: NextFunction) => {
  return res.json("Vendors");
};
export const getVendorById = (req: Request, res: Response, next: NextFunction) => {
  return res.json;
};
