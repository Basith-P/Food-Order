import { Router, Request, Response } from "express";
import { createVender, getVenderById, getVenders } from "../controllers";

const router = Router();

router.route("/vendors").get(getVenders).post(createVender);
router.get("/vendors/:id", getVenderById);

router.get("/", (req: Request, res: Response) => {
  return res.send("Hello from Admin");
});

export { router as AdminRouter };
