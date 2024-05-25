import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/PasswordUtility";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const isValid = verifyToken(req);
  if (!isValid) return res.status(403).json({ msg: "Unauthorized" });
  next();
};
