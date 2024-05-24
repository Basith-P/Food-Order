import { Router, Request, Response } from "express";
import { createVendor, getVendorById, getVendors } from "../controllers";

const router = Router();

router.route("/vendors").get(getVendors).post(createVendor);
router.get("/vendors/:id", getVendorById);

router.get("/", (req: Request, res: Response) => {
  return res.send("Hello from Admin");
});

export { router as AdminRouter };
