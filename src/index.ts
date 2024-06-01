import express from "express";
import mongoose from "mongoose";
import path from "path";

import { AdminRouter, VenderRouter } from "./routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "images")));

mongoose
  .connect("mongodb://localhost:27017/dev_db")
  .then(() => console.log("MONGO DB CONNECTED"));

app.use("/admin", AdminRouter);
app.use("/vendor", VenderRouter);

app.listen(3000, () => {
  console.clear();
  console.log("App is running on 3000");
});
