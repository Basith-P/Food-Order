import mongoose from "mongoose";

export default async () => {
  try {
    console.log(process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI!);
    console.clear();
    console.log("MONGO DB CONNECTED");
  } catch (error) {
    console.log("MONGO DB CONNECTION ERROR", error);
  }
};
