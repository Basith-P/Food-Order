"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRouter = void 0;
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.CustomerRouter = router;
router.post("/signup", controllers_1.customerSignup);
router.post("/signin", controllers_1.customerSignin);
router.use(middlewares_1.authenticate);
router.post("/verify", controllers_1.customerVerify);
router.post("/otp", controllers_1.requestOTP);
router.route("/profile").get(controllers_1.getCustomerProfile).patch(controllers_1.editCustomerProfile);
//# sourceMappingURL=CustomerRouter.js.map