import { Document, Schema, model } from "mongoose";
import { IVender } from "./Vender";

export interface IOffer extends Document {
  type: string;
  vendors: string[] | IVender[];
  title: string;
  desc: string;
  discount: number;
  minVal: number;
  startDate: Date;
  endDate: Date;
  promoCode: string;
  promoType: string; // USER (only once for user), BANK, ALL, CARD
  bank: any[];
  bins: any[];
  pincode: number[];
  isActive: boolean;
}

const OfferSchema = new Schema(
  {
    type: { type: String, required: true },
    vendors: [{ type: Schema.Types.ObjectId, ref: "Vender" }],
    title: { type: String, required: true },
    desc: { type: String, required: true },
    discount: { type: Number, required: true },
    minVal: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    promoCode: { type: String, required: true },
    promoType: { type: String, required: true },
    bank: [{ type: String }],
    bins: [{ type: Number }],
    pincode: [{ type: Number }],
    isActive: { type: Boolean, default: true },
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

export default model<IOffer>("Offer", OfferSchema);
