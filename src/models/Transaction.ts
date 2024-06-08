import { Document, Schema, model } from "mongoose";

import { ICustomer } from "./Customer";
import { IOrder } from "./Order";
import { IVender } from "./Vender";

export interface ITransaction extends Document {
    customer: string | ICustomer;
    vendor: string | IVender;
    order: string | IOrder;
    amount: number;
    offerUsed?: string;
    status: string;
    payMode: string;
    payResponse: string;
}

const TransactionSchema = new Schema({
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    amount: { type: Number, required: true },
    offerUsed: { type: String },
    status: { type: String, default: "pending" },
    payMode: { type: String, required: true },
    payResponse: { type: String, default: null },
},
{
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
    },
  },
});

export default model<ITransaction>("Transaction", TransactionSchema);