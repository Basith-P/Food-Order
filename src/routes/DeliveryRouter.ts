import { Router } from "express";
import { authenticate } from "../middlewares";
import {
  changeDeliveryStatus,
  deliveryUserLogin,
  deliveryUserSignUp,
  getDeliveryUserProfile,
  updateDeliveryUserProfile,
} from "../controllers";

const router = Router();

router.post("/signup", deliveryUserSignUp);
router.post("/login", deliveryUserLogin);

router.use(authenticate);

router.put("/change-status", changeDeliveryStatus);

router
  .route("/profile")
  .get(getDeliveryUserProfile)
  .patch(updateDeliveryUserProfile);

export { router as DeliveryRouter };
