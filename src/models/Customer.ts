import { Schema, model, Document } from "mongoose";
import { IOrder } from "./Order";
import { IFood } from "./Food";

export interface ICustomer extends Document {
  email: string;
  password: string;
  phone: string;
  salt: string;
  firstName: string;
  lastName: string;
  address: string;
  isVeified: boolean;
  otp: number;
  otpExpires: Date;
  lat: number;
  lng: number;
  cart: { food: any; units: number }[];
  orders: string[] | IOrder[];
}

const CustomerSchema = new Schema(
  {
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
    cart: [
      {
        food: { type: Schema.Types.ObjectId, ref: "Food", required: true },
        units: { type: Number, required: true },
        _id: false,
      },
    ],
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  },
  {
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
  }
);

export default model<ICustomer>("Customer", CustomerSchema);
