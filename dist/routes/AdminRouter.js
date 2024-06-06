"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
exports.AdminRouter = router;
router.route("/vendors").get(controllers_1.getVenders).post(controllers_1.createVender);
router.get("/vendors/:id", controllers_1.getVenderById);
router.get("/", (req, res) => {
    return res.send("Hello from Admin");
});
//# sourceMappingURL=AdminRouter.js.map