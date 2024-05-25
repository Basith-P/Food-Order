import { Router, Request, Response } from "express";
import { vendorLogin } from "../controllers";

const router = Router();

router.post("/login", vendorLogin);

router.get("/", (req: Request, res: Response) => {
  return res.send("Hello from Vendor");
});

export { router as VendorRouter };
