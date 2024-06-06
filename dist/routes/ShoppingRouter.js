"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRouter = void 0;
const controllers_1 = require("../controllers");
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.ShoppingRouter = router;
// ------------ Food Availablity ------------ //
router.get("/:pincode", controllers_1.getFoodAvailability);
// ------------ Top Restaurents ------------ //
router.get("/top-restaurants/:pincode", controllers_1.getTopRestaurants);
// ------------ Food Availablity in 30m ------------ //
router.get("/food-in-30-min/:pincode", controllers_1.getFoodIn30min);
// ------------ Search Foods ------------ //
router.get("/search/:pincode", controllers_1.searchFoods);
// ------------ Find Restaurant by ID ------------ //
router.get("/restaurant/:id", controllers_1.getVenderById);
//# sourceMappingURL=ShoppingRouter.js.map