import { Document, Schema, model } from "mongoose";
import { IVender } from "./Vender";

export interface IOrder extends Document {
  items: { food: string; units: number }[];
  total: number;
  customer: string;
  date: Date;
  payMethod: string;
  payResponse: string;
  status: string;
  vendor: string | IVender;
  remarks?: string;
  deliveryId?: string;
  deliveryTime?: number;
  offers?: string;
}

const OrderSchema = new Schema(
  {
    items: [
      {
        food: {
          type: Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        units: {
          type: Number,
          required: true,
        },
        _id: false,
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    payMethod: {
      type: String,
      required: true,
    },
    payResponse: { type: String },
    status: {
      type: String,
      default: "pending",
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    remarks: { type: String },
    deliveryId: { type: String },
    deliveryTime: { type: Number },
    offers: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
  }
);

export default model<IOrder>("Order", OrderSchema);
