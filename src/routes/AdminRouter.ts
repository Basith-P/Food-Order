import { Router, Request, Response } from "express";
import { createVender, getAllDeliveryUsers, getTxnById, getTxns, getVenderById, getVenders, verifyDeliveryUser } from "../controllers";

const router = Router();

router.route("/vendors").get(getVenders).post(createVender);
router.get("/vendors/:id", getVenderById);

router.get("/transactions", getTxns);
router.get("/transactions/:id", getTxnById);

router.get("/delivery/all", verifyDeliveryUser);
router.put("/delivery/users", getAllDeliveryUsers)

export { router as AdminRouter };
