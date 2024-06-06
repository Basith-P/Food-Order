import { Document, Schema, model } from "mongoose";

export interface IOrder extends Document {
  items: { food: string; units: number }[];
  total: number;
  customer: string;
  date: Date;
  payMethod: string;
  payResponse: string;
  status: string;
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
