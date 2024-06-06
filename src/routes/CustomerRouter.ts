import { authenticate } from "../middlewares";
import { customerSignup, customerVerify } from "../controllers";
import e, { Router } from "express";

const router = Router();

router.post("/signup", customerSignup);

router.use(authenticate);
router.post("/verify", customerVerify);

export { router as CustomerRouter };
