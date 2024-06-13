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
  });
};

startServer();

process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err)
  process.exit(1)
})