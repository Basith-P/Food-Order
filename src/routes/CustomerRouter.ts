import { authenticate } from "../middlewares";
import {
  addToCart,
  createOrder,
  customerSignin,
  customerSignup,
  customerVerify,
  clearCart,
  editCustomerProfile,
  getCart,
  getCustomerProfile,
  getOrderById,
  getVendorOrders,
  requestOTP,
  getOrders,
  veifyOffer,
  createPayment,
} from "../controllers";
import e, { Router } from "express";

const router = Router();

router.post("/signup", customerSignup);
router.post("/signin", customerSignin);

router.use(authenticate);
router.post("/verify", customerVerify);
router.post("/otp", requestOTP);
router.route("/profile").get(getCustomerProfile).patch(editCustomerProfile);

// CART
router.route("/cart").get(getCart).post(addToCart).delete(clearCart);

// OFFERS
router.get('/offers/verify/:id', veifyOffer)

// PAY
router.post('/create-payment', createPayment)

// ORDERS
router.route("/orders").get(getOrders).post(createOrder);
router.route("/orders/:id").get(getOrderById);

export { router as CustomerRouter };
