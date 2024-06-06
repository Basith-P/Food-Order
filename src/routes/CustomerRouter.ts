import { authenticate } from "../middlewares";
import { customerSignin, customerSignup, customerVerify } from "../controllers";
import e, { Router } from "express";

const router = Router();

router.post("/signup", customerSignup);
router.post("/signin", customerSignin);

router.use(authenticate);
router.post("/verify", customerVerify);

export { router as CustomerRouter };
