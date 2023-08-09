import * as url from "node:url";

import authRoute from "./routes/auth.js";
import { config } from "dotenv";
import connectDB from "./config/dbConn.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import credentials from "./middleware/credentials.js";
import employeesRoute from "./routes/api/v1/employees.js";
import errorHandler from "./middleware/errorHandler.js";
import express from "express";
import logger from "./middleware/logEvents.js";
import logoutRoute from "./routes/logout.js";
import mongoose from "mongoose";
import path from "node:path";
import refreshRoute from "./routes/refresh.js";
import registerRoute from "./routes/register.js";
import rootRoute from "./routes/root.js";
import verifyJWT from "./middleware/verifyJWT.js";

config();

// Connecto MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5050;
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS
// and fetch cookies credentials requirement
app.use(credentials);

app.use(cors(corsOptions));

// built-in middlware to handle urlencoded data
// in other words, from data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// API Endpoint
app.use("/", rootRoute);
app.use("/register", registerRoute);
app.use("/auth", authRoute);
app.use("/refresh", refreshRoute);
app.use("/logout", logoutRoute);

app.use(verifyJWT);
app.use("/v1/employees", employeesRoute); // only this route need JWT verified

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
