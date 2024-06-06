import express from "express";
import "dotenv/config";

import configureApp from "./services/ExpressApp";
import dbConnect from "./services/DbConnect";

const startServer = async () => {
  const app = express();
  await dbConnect();
  await configureApp(app);
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
};

startServer();
