import { logEvents } from "./logEvents.js";

const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, `errLog.txt`);
  console.log(err.stack);
  res.status(500).send(err.message);
};

export default errorHandler;
