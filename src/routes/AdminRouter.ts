import { Router, Request, Response } from "express";
import { createVender, getTxnById, getTxns, getVenderById, getVenders } from "../controllers";

const router = Router();

router.route("/vendors").get(getVenders).post(createVender);
router.get("/vendors/:id", getVenderById);

router.get("/transactions", getTxns);
router.get("/transactions/:id", getTxnById);

export { router as AdminRouter };
