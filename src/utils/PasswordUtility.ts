import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { AuthPayload, VenderPayload } from "../dto";
import { Request } from "express";

export const generateSalt = async () => {
  return await bcrypt.genSalt();
};

export const encryptPassword = async (passwd: string, salt: string) => {
  return await bcrypt.hash(passwd, salt);
};

export const validatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  const encrypted = await encryptPassword(enteredPassword, salt);
  // console.log(encrypted === savedPassword);
  return encrypted === savedPassword;
};

export const generateToken = (payload: VenderPayload) => {
  return jwt.sign(payload, "secret", { expiresIn: "1h" });
};

export const verifyToken = (req: Request) => {
  const auth = req.headers.authorization;
  if (auth == null) return false;
  const token = auth.split(" ")[1];
  const payload = jwt.verify(token, "secret") as AuthPayload;
  req.user = payload;
  return true;
};
