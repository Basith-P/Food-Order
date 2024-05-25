import { Router, Request, Response } from "express";
import { getVenderProfile, updateVendorProfile, venderLogin } from "../controllers";
import { authenticate } from "../middlewares";

const router = Router();

router.post("/login", venderLogin);

router.use(authenticate);
router.route("/profile").get(getVenderProfile).patch(updateVendorProfile);

router.get("/", (req: Request, res: Response) => {
  return res.send("Hello from Vender");
});

export { router as VenderRouter };
