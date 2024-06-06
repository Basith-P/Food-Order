"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFoods = exports.addFood = exports.updateVendorService = exports.updateVendorCoverimages = exports.updateVendorProfile = exports.getVenderProfile = exports.venderLogin = void 0;
const AdminController_1 = require("./AdminController");
const PasswordUtility_1 = require("../utils/PasswordUtility");
const Food_1 = __importDefault(require("../models/Food"));
const venderLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const vendor = yield (0, AdminController_1.findVender)("", email);
    if (vendor == null)
        return res.status(401).json({ msg: "Vender with this email does not exist" });
    const isValid = yield (0, PasswordUtility_1.validatePassword)(password, vendor.password, vendor.salt);
    if (!isValid)
        return res.status(401).json({ msg: "Invalid password" });
    const token = (0, PasswordUtility_1.generateToken)({
        _id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        foodType: vendor.foodType,
    });
    // if (token == null) return res.status(500).json({ msg: "Something went wrong!" });
    return res.json({ token });
});
exports.venderLogin = venderLogin;
const getVenderProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res.status(401).json({ msg: "Unauthorized" });
    const vendor = yield (0, AdminController_1.findVender)(user._id);
    if (vendor == null)
        return res.status(404).json({ msg: "Vendor not found" });
    return res.json({ data: vendor });
});
exports.getVenderProfile = getVenderProfile;
const updateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res.status(401).json({ msg: "Unauthorized" });
    const vendor = yield (0, AdminController_1.findVender)(user._id);
    if (vendor == null)
        return res.status(404).json({ msg: "Vendor not found" });
    const { address, phone, foodType, name } = req.body;
    if (address)
        vendor.address = address;
    if (phone)
        vendor.phone = phone;
    if (foodType)
        vendor.foodType = foodType;
    if (name)
        vendor.name = name;
    const result = yield vendor.save();
    return res.json({ data: result, msg: "Profile updated" });
});
exports.updateVendorProfile = updateVendorProfile;
const updateVendorCoverimages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res.status(401).json({ msg: "Unauthorized" });
    const vendor = yield (0, AdminController_1.findVender)(user._id);
    if (vendor == null)
        return res.status(404).json({ msg: "Vendor not found" });
    const images = req.files;
    const imageNames = images.map((image) => image.filename);
    vendor.coverImages.push(...imageNames);
    const result = yield vendor.save();
    return res.json({ data: result, msg: "Profile image updated" });
});
exports.updateVendorCoverimages = updateVendorCoverimages;
const updateVendorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res.status(401).json({ msg: "Unauthorized" });
    const vendor = yield (0, AdminController_1.findVender)(user._id);
    if (vendor == null)
        return res.status(404).json({ msg: "Vendor not found" });
    const { isServiceAvailable } = req.body;
    vendor.isServiceAvailable = isServiceAvailable;
    const result = yield vendor.save();
    return res.json({ data: result, msg: "Updated" });
});
exports.updateVendorService = updateVendorService;
const addFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res.status(401).json({ msg: "Unauthorized" });
    const vendor = yield (0, AdminController_1.findVender)(user._id);
    if (vendor == null)
        return res.status(404).json({ msg: "Vendor not found" });
    const { name, desc, category, foodType, readyTime, price } = req.body;
    const images = req.files;
    const imagePaths = images.map((image) => image.filename);
    const food = yield Food_1.default.create({
        venderId: vendor.id,
        name,
        desc,
        category,
        foodType,
        readyTime,
        price,
        images: imagePaths,
    });
    if (vendor.foods == null)
        vendor.foods = [food.id];
    else
        vendor.foods.push(food.id);
    yield vendor.save();
    return res.json({ data: food, msg: "Food added" });
});
exports.addFood = addFood;
const getFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res.status(401).json({ msg: "Unauthorized" });
    const vendor = yield (0, AdminController_1.findVender)(user._id);
    if (vendor == null)
        return res.status(404).json({ msg: "Vendor not found" });
    const foods = yield Food_1.default.find({ venderId: vendor.id });
    return res.json({ data: foods });
});
exports.getFoods = getFoods;
//# sourceMappingURL=VenderController.js.map