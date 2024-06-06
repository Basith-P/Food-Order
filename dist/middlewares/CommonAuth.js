"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const PasswordUtility_1 = require("../utils/PasswordUtility");
const authenticate = (req, res, next) => {
    const isValid = (0, PasswordUtility_1.verifyToken)(req);
    if (!isValid)
        return res.status(403).json({ msg: "Unauthorized" });
    next();
};
exports.authenticate = authenticate;
//# sourceMappingURL=CommonAuth.js.map