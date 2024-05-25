import { Router, Request, Response } from "express";
import { getVenderProfile, venderLogin } from "../controllers";
import { authenticate } from "../middlewares";

const router = Router();

router.post("/login", venderLogin);
router.get("/profile", authenticate, getVenderProfile);

router.get("/", (req: Request, res: Response) => {
  return res.send("Hello from Vender");
});

export { router as VenderRouter };
