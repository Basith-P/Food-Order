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
exports.getVenderById = exports.getVenders = exports.createVender = exports.findVender = void 0;
const Vender_1 = __importDefault(require("../models/Vender"));
const PasswordUtility_1 = require("../utils/PasswordUtility");
const findVender = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email != null)
        return Vender_1.default.findOne({ email });
    else
        return Vender_1.default.findById(id);
});
exports.findVender = findVender;
const createVender = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, pincode, email, phone, ownerName, password, foodType } = req.body;
    const existingVender = yield (0, exports.findVender)("", email);
    if (existingVender != null)
        return res.status(401).json({ msg: "Vender with email already exists" });
    const salt = yield (0, PasswordUtility_1.generateSalt)();
    const passwd = yield (0, PasswordUtility_1.encryptPassword)(password, salt);
    const createVenderRes = yield Vender_1.default.create({
        name: name,
        address: address,
        pincode: pincode,
        email: email,
        phone: phone,
        ownerName: ownerName,
        password: passwd,
        foodType: foodType,
        rating: 0,
        coverImages: [],
        salt: salt,
        isServiceAvailable: false,
    });
    return res.json({ data: createVenderRes });
});
exports.createVender = createVender;
const getVenders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield Vender_1.default.find();
    return res.json({ data: vendors });
});
exports.getVenders = getVenders;
const getVenderById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const vendor = yield (0, exports.findVender)(id);
    return res.json({ data: vendor });
});
exports.getVenderById = getVenderById;
//# sourceMappingURL=AdminController.js.map