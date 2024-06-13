import express, { Application } from "express";
import mongoose from "mongoose";
import path from "path";

import { AdminRouter, ShoppingRouter, VenderRouter, CustomerRouter, DeliveryRouter } from "../routes";

const configureApp = async (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/images", express.static(path.join(__dirname, "../images")));

  app.use("/admin", AdminRouter);
  app.use("/vendor", VenderRouter);
  app.use("/shopping", ShoppingRouter);
  app.use("/users", CustomerRouter);
  app.use("/delivery", DeliveryRouter);

  return app;
};

export default configureApp;
