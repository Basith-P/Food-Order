import { Schema, Document, model } from "mongoose";
import { IFood } from "./Food";

interface IVender extends Document {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  isServiceAvailable: boolean;
  coverImages: [string];
  rating: number;
  foods?: any;
}

const VenderSchema = new Schema(
  {
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
    foods: { type: [Schema.Types.ObjectId], ref: "Food", required: false },
  },
  {
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
  }
);

export default model<IVender>("Vender", VenderSchema);
