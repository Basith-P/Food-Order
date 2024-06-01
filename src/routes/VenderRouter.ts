import { Router, Request, Response } from "express";
import {
  addFood,
  getFoods,
  getVenderProfile,
  updateVendorProfile,
  updateVendorService,
  venderLogin,
} from "../controllers";
import { authenticate } from "../middlewares";

const router = Router();

router.post("/login", venderLogin);

router.use(authenticate);
router.route("/profile").get(getVenderProfile).patch(updateVendorProfile);
router.route("/services").patch(updateVendorService);

router.route("/foods").get(getFoods).post(addFood);

router.get("/", (req: Request, res: Response) => {
  return res.send("Hello from Vender");
});

export { router as VenderRouter };
