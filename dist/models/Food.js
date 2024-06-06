"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FoodSchema = new mongoose_1.Schema({
    venderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Vender" },
    name: { type: String, required: true },
    desc: { type: String, required: true },
    category: { type: String, required: true },
    foodType: { type: String, required: true },
    readyTime: { type: Number },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    images: { type: [String], required: true },
}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        },
    },
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Food", FoodSchema);
//# sourceMappingURL=Food.js.map