"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenderRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
exports.VenderRouter = router;
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + "-" + file.originalname);
    },
});
const imageFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const upload = (0, multer_1.default)({
    storage: imageStorage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: imageFilter,
}).array("images", 5);
router.post("/login", controllers_1.venderLogin);
router.use(middlewares_1.authenticate);
router.route("/profile").get(controllers_1.getVenderProfile).patch(controllers_1.updateVendorProfile);
router.route("/cover-images").patch(controllers_1.updateVendorCoverimages);
router.route("/services").patch(upload, controllers_1.updateVendorService);
router.route("/foods").get(controllers_1.getFoods).post(upload, controllers_1.addFood);
router.get("/", (req, res) => {
    return res.send("Hello from Vender");
});
//# sourceMappingURL=VenderRouter.js.map