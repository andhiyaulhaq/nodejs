import cors from "cors";
import express from "express";
import path from "node:path";
import * as url from "url";

import corsOptions from "./config/corsOptions.js";
import errorHandler from "./middleware/errorHandler.js";
import logger from "./middleware/logEvents.js";

import rootRoute from "./routes/root.js";
import registerRoute from "./routes/register.js";
import authRoute from "./routes/auth.js";
import employeesRoute from "./routes/api/v1/employees.js";

const app = express();
const PORT = process.env.PORT || 5050;
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// custom middleware logger
app.use(logger);
app.use(cors(corsOptions));

// built-in middlware to handle urlencoded data
// in other words, from data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// API Endpoint
app.use("/", rootRoute);
app.use("/register", registerRoute);
app.use("/auth", authRoute);
app.use("/v1/employees", employeesRoute);

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
