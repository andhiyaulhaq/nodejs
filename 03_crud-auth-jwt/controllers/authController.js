import bcrypt from "bcrypt";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import fsPromises from "node:fs/promises";
import path from "node:path";
import * as url from "node:url";

config();

import users from "../model/users.json" assert { type: "json" };

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const usersDB = {
  users: users,
  setUsers: function (data) {
    this.users = data;
  }
};

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  console.log("test");
  console.log(user, " ", pwd);
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  const foundUser = usersDB.users.find((person) => person.username === user);
  if (!foundUser) return res.sendStatus(401); // Unauthorized
  // // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // --- create JWT---
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // Saving refreshToken with current user
    const otherUsers = usersDB.users.filter(
      (person) => person.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

export default handleLogin;
