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
exports.editCustomerProfile = exports.getCustomerProfile = exports.requestOTP = exports.customerVerify = exports.customerSignin = exports.customerSignup = void 0;
const class_transformer_1 = require("class-transformer");
const dto_1 = require("../dto");
const class_validator_1 = require("class-validator");
const utils_1 = require("../utils");
const Customer_1 = __importDefault(require("../models/Customer"));
const customerSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const inputs = (0, class_transformer_1.plainToClass)(dto_1.CreateCustomerInputs, req.body);
    const errors = yield (0, class_validator_1.validate)(inputs, { validationError: { target: false } });
    if (errors.length > 0)
        return res.status(400).json(errors);
    const { email, password, phone } = inputs;
    const customer = yield Customer_1.default.findOne({ email });
    if (customer)
        return res.status(400).json({ msg: "Email already exists" });
    const salt = yield (0, utils_1.generateSalt)();
    const passwordHash = yield (0, utils_1.encryptPassword)(password, salt);
    const { otp, otpExpires } = (0, utils_1.generateOTP)();
    const result = yield Customer_1.default.create({
        email,
        password: passwordHash,
        phone,
        salt,
        otp,
        otpExpires,
        firstName: "",
        lastName: "",
    });
    if (!result)
        return res.status(500).json({ msg: "Failed to create customer" });
    yield (0, utils_1.onRequestOTP)(otp, phone);
    const token = (0, utils_1.generateToken)({
        _id: result.id.toString(),
        email: result.email,
        isVerified: result.isVeified,
    });
    return res.json({ token, isVerified: result.isVeified, email: result.email });
});
exports.customerSignup = customerSignup;
const customerSignin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToClass)(dto_1.CustomerLginInputs, req.body);
    const errors = yield (0, class_validator_1.validate)(loginInputs, { validationError: { target: false } });
    if (errors.length > 0)
        return res.status(400).json(errors);
    const { email, password } = loginInputs;
    const customer = yield Customer_1.default.findOne({ email });
    if (!customer)
        return res.status(400).json({ msg: "Invalid email or password" });
    const isValid = yield (0, utils_1.validatePassword)(password, customer.password, customer.salt);
    if (!isValid)
        return res.status(400).json({ msg: "Invalid email or password" });
    const token = (0, utils_1.generateToken)({
        _id: customer.id.toString(),
        email: customer.email,
        isVerified: customer.isVeified,
    });
    return res.json({ token, isVerified: customer.isVeified, email: customer.email });
});
exports.customerSignin = customerSignin;
const customerVerify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    if (!customer)
        return res.status(401).json({ msg: "Unauthorized" });
    const profile = yield Customer_1.default.findById(customer._id);
    if (!profile)
        return res.status(404).json({ msg: "Customer not found" });
    if (profile.otp !== parseInt(otp))
        return res.status(400).json({ msg: "Invalid OTP" });
    if (profile.otpExpires < new Date())
        return res.status(400).json({ msg: "OTP expired" });
    profile.isVeified = true;
    yield profile.save();
    return res.json({ msg: "Customer verified" });
});
exports.customerVerify = customerVerify;
const requestOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (!customer)
        return res.status(401).json({ msg: "Unauthorized" });
    const profile = yield Customer_1.default.findById(customer._id);
    if (!profile)
        return res.status(404).json({ msg: "Customer not found" });
    const { otp, otpExpires } = (0, utils_1.generateOTP)();
    profile.otp = otp;
    profile.otpExpires = otpExpires;
    yield profile.save();
    yield (0, utils_1.onRequestOTP)(otp, profile.phone);
    return res.json({ msg: "OTP sent" });
});
exports.requestOTP = requestOTP;
const getCustomerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (!customer)
        return res.status(401).json({ msg: "Unauthorized" });
    const profile = yield Customer_1.default.findById(customer._id);
    if (!profile)
        return res.status(404).json({ msg: "Customer not found" });
    return res.json({ data: profile });
});
exports.getCustomerProfile = getCustomerProfile;
const editCustomerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const profileInputs = (0, class_transformer_1.plainToClass)(dto_1.EditCustomerInputs, req.body);
    const errors = yield (0, class_validator_1.validate)(profileInputs, { validationError: { target: false } });
    if (errors.length > 0)
        return res.status(400).json(errors);
    const customer = req.user;
    if (!customer)
        return res.status(401).json({ msg: "Unauthorized" });
    const profile = yield Customer_1.default.findById(customer._id);
    if (!profile)
        return res.status(404).json({ msg: "Customer not found" });
    const { firstName, lastName, address } = profileInputs;
    if (firstName)
        profile.firstName = firstName;
    if (lastName)
        profile.lastName = lastName;
    if (address)
        profile.address = address;
    const result = yield profile.save();
    return res.json({ data: result, msg: "Profile updated" });
});
exports.editCustomerProfile = editCustomerProfile;
//# sourceMappingURL=CustomerController.js.map