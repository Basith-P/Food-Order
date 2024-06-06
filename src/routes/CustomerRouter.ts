import { authenticate } from "../middlewares";
import {
  createOrder,
  customerSignin,
  customerSignup,
  customerVerify,
  editCustomerProfile,
  getCustomerProfile,
  getOrderById,
  getOrders,
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

// ORDERS
router.route("/orders").get(getOrders).post(createOrder);
router.route("/orders/:id").get(getOrderById);

export { router as CustomerRouter };
