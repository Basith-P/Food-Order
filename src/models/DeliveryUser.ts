import { Document, Schema, model } from "mongoose";

export interface DeliveryUser extends Document {
  email: string;
  password: string;
  phone: string;
  salt: string;
  firstName: string;
  lastName: string;
  address: string;
  pincode: string;
  lat: number;
  lng: number;
  isVeified: boolean;
  isAvailable: boolean;
}

const DeliveryUserSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    pincode: { type: String, required: true},
    lat: { type: Number },
    lng: { type: Number },
    isVeified: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: false },
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
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
  }
);


export default model<DeliveryUser>("DeliveryUser", DeliveryUserSchema);