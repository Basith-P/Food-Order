import {
  getFoodAvailability,
  getFoodIn30min,
  getTopRestaurants,
  getVenderById,
  searchFoods,
} from "../controllers";
import { Router } from "express";

const router = Router();

// ------------ Food Availablity ------------ //
router.get("/:pincode", getFoodAvailability);

// ------------ Top Restaurents ------------ //
router.get("/top-restaurants/:pincode", getTopRestaurants);

// ------------ Food Availablity in 30m ------------ //
router.get("/food-in-30-min/:pincode", getFoodIn30min);

// ------------ Search Foods ------------ //
router.get("/search/:pincode", searchFoods);

// ------------ Find Restaurant by ID ------------ //
router.get("/restaurant/:id", getVenderById);

export { router as ShoppingRouter };
