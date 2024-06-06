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
exports.getRestaurantById = exports.searchFoods = exports.getFoodIn30min = exports.getTopRestaurants = exports.getFoodAvailability = void 0;
const Vender_1 = __importDefault(require("../models/Vender"));
const Food_1 = __importDefault(require("../models/Food"));
const getFoodAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const vendors = yield Vender_1.default.find({ pincode, isServiceAvailable: true })
        .sort({ rating: -1 })
        .limit(10)
        .populate("foods");
    return res.status(200).json({ data: vendors });
});
exports.getFoodAvailability = getFoodAvailability;
const getTopRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const vendors = yield Vender_1.default.find({ pincode, isServiceAvailable: true })
        .sort({ rating: -1 })
        .limit(2);
    return res.status(200).json({ data: vendors });
});
exports.getTopRestaurants = getTopRestaurants;
const getFoodIn30min = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    // const result = await Vender.find({ pincode, isServiceAvailable: true }).populate({
    //   path: "foods",
    //   match: { readyTime: { $lte: 30 } },
    // });
    const result = yield Food_1.default.find({ readyTime: { $lte: 30 } }).populate("venderId");
    return res.status(200).json({ data: result });
});
exports.getFoodIn30min = getFoodIn30min;
const searchFoods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const { query } = req.query;
    const result = yield Food_1.default.find({ name: { $regex: query, $options: "i" } }).populate("venderId");
    return res.status(200).json({ data: result });
});
exports.searchFoods = searchFoods;
const getRestaurantById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield Vender_1.default.findById(id).populate("foods");
    return res.status(200).json({ data: result });
});
exports.getRestaurantById = getRestaurantById;
//# sourceMappingURL=ShoppingController.js.map