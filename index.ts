import express from "express";

import { AdminRouter, VendorRouter } from "./routes";
import mongoose from "mongoose";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://localhost:27017/dev_db")
  .then(() => console.log("MONGO DB CONNECTED"));

app.use("/admin", AdminRouter);
app.use("/vendor", VendorRouter);

app.listen(3000, () => {
  console.clear();
  console.log("App is running on 3000");
});
