import { Request, Response, NextFunction } from "express";
import { CreateVenderInput } from "../dto";

import Vender from "../models/Vender";
import { encryptPassword, generateSalt } from "../utils/PasswordUtility";
import Transaction from "../models/Transaction";
import DeliveryUser from "../models/DeliveryUser";

export const findVender = async (id: string | undefined, email?: string) => {
  if (email != null) return Vender.findOne({ email });
  else return Vender.findById(id);
};

export const createVender = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    address,
    pincode,
    email,
    phone,
    ownerName,
    password,
    foodType,
  } = <CreateVenderInput>req.body;

  const existingVender = await findVender("", email);
  if (existingVender != null)
    return res.status(401).json({ msg: "Vender with email already exists" });

  const salt = await generateSalt();
  const passwd = await encryptPassword(password, salt);

  const createVenderRes = await Vender.create({
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
    lat: 0,
    lng: 0,
  });

  return res.json({ data: createVenderRes });
};

export const getVenders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendors = await Vender.find();
  return res.json({ data: vendors });
};
export const getVenderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const vendor = await findVender(id);
  return res.json({ data: vendor });
};

export const getTxns = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const txn = await Transaction.find();
  return res.json({ data: txn });
};

export const getTxnById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const txn = await Transaction.findById(id);
  return res.json({ data: txn });
};

export const verifyDeliveryUser = async (req: Request, res: Response) => {
  const { id, isVeified } = req.params;
  const user = await findVender(id);
  if (!user) return res.status(404).json({ msg: "User not found" });

  const updatedUser = await DeliveryUser.findByIdAndUpdate(
    id,
    { isVeified },
    { new: true }
  );
  return res.json({ data: updatedUser });
};

export const getAllDeliveryUsers = async (req: Request, res: Response) => {
  const users = await DeliveryUser.find();
  return res.json({ data: users });
}