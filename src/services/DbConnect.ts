import mongoose from "mongoose";

export default async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/dev_db");
    console.log("MONGO DB CONNECTED");
  } catch (error) {
    console.log("MONGO DB CONNECTION ERROR", error);
  }
};
