import express from "express";
import "dotenv/config";

import configureApp from "./services/ExpressApp";
import dbConnect from "./services/DbConnect";

const startServer = async () => {
  const app = express();
  await dbConnect();
  await configureApp(app);
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    // log current date in utc format and date after 1 month
    // console.log(new Date());
    // console.log(new Date(new Date().setMonth(new Date().getMonth() + 1)));
  });
};

startServer();
