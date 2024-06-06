import { customerSignup } from "../controllers";
import e, { Router } from "express";

const router = Router();

router.post("/signup", customerSignup);

export { router as CustomerRouter };
