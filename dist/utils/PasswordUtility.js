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
exports.verifyToken = exports.generateToken = exports.validatePassword = exports.encryptPassword = exports.generateSalt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.genSalt();
});
exports.generateSalt = generateSalt;
const encryptPassword = (passwd, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(passwd, salt);
});
exports.encryptPassword = encryptPassword;
const validatePassword = (enteredPassword, savedPassword, salt) => __awaiter(void 0, void 0, void 0, function* () {
    const encrypted = yield (0, exports.encryptPassword)(enteredPassword, salt);
    // console.log(encrypted === savedPassword);
    return encrypted === savedPassword;
});
exports.validatePassword = validatePassword;
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, "secret", { expiresIn: "1h" });
};
exports.generateToken = generateToken;
const verifyToken = (req) => {
    const auth = req.headers.authorization;
    if (auth == null)
        return false;
    const token = auth.split(" ")[1];
    const payload = jsonwebtoken_1.default.verify(token, "secret");
    req.user = payload;
    return true;
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=PasswordUtility.js.map