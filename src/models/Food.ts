import { model, Schema, Document } from "mongoose";

export interface IFood extends Document {
  venderId: string;
  name: string;
  desc: string;
  category: string;
  foodType: string;
  readyTime: number;
  price: number;
  rating: number;
  images: [string];
}

const FoodSchema = new Schema(
  {
    venderId: { type: Schema.Types.ObjectId, ref: "Vender" },
    name: { type: String, required: true },
    desc: { type: String, required: true },
    category: { type: String, required: true },
    foodType: { type: String, required: true },
    readyTime: { type: Number },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    images: { type: [String], required: true },
  },
  {
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
  }
);

export default model<IFood>("Food", FoodSchema);
