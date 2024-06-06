"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const VenderSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String], required: true },
    pincode: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    isServiceAvailable: { type: Boolean },
    coverImages: { type: [String] },
    rating: { type: Number },
    foods: { type: [mongoose_1.Schema.Types.ObjectId], ref: "Food", required: false },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
            return ret;
        },
    },
});
exports.default = (0, mongoose_1.model)("Vender", VenderSchema);
//# sourceMappingURL=Vender.js.map