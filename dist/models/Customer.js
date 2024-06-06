"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CustomerSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    isVeified: { type: Boolean, default: false },
    otp: { type: Number },
    otpExpires: { type: Date },
    lat: { type: Number },
    lng: { type: Number },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            delete ret.salt;
            delete ret.otp;
            delete ret.otpExpires;
            delete ret.createdAt;
            delete ret.updatedAt;
        },
    },
});
exports.default = (0, mongoose_1.model)("Customer", CustomerSchema);
//# sourceMappingURL=Customer.js.map