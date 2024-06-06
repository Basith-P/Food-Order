import { authenticate } from "../middlewares";
import {
  customerSignin,
  customerSignup,
  customerVerify,
  editCustomerProfile,
  getCustomerProfile,
  requestOTP,
} from "../controllers";
import e, { Router } from "express";

const router = Router();

router.post("/signup", customerSignup);
router.post("/signin", customerSignin);

router.use(authenticate);
router.post("/verify", customerVerify);
router.post("/otp", requestOTP);
router.route("/profile").get(getCustomerProfile).patch(editCustomerProfile);

export { router as CustomerRouter };
