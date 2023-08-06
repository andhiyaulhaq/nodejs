import express from "express";
import path from "path";
import * as url from "url";

const router = express.Router();
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

export default router;
