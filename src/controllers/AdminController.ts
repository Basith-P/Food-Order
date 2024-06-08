import { Request, Response, NextFunction } from "express";
import { CreateVenderInput } from "../dto";

import Vender from "../models/Vender";
import { encryptPassword, generateSalt } from "../utils/PasswordUtility";
import Transaction from "../models/Transaction";

export const findVender = async (id: string | undefined, email?: string) => {
  if (email != null) return Vender.findOne({ email });
  else return Vender.findById(id);
};

export const createVender = async (req: Request, res: Response, next: NextFunction) => {
  const { name, address, pincode, email, phone, ownerName, password, foodType } = <
    CreateVenderInput
  >req.body;

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
  });

  return res.json({ data: createVenderRes });
};

export const getVenders = async (req: Request, res: Response, next: NextFunction) => {
  const vendors = await Vender.find();
  return res.json({ data: vendors });
};
export const getVenderById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const vendor = await findVender(id);
  return res.json({ data: vendor });
};

export const getTxns = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const txn = await Transaction.find();
  return res.json({ data: txn });
}

export const getTxnById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const txn = await Transaction.findById(id);
  return res.json({ data: txn });
}