import bcrypt from "bcrypt";
import fsPromises from "node:fs/promises";
import path from "node:path";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

import users from "../model/users.json" assert { type: "json" };
const usersDB = {
  users: users,
  setUsers: function (data) {
    this.users = data;
  }
};

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  // check for duplicate usernames in the db
  const duplicate = usersDB.users.find((person) => person.username === user);
  if (duplicate) return res.sendStatus(409); // Conflict
  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // store the new user
    const newUser = {
      username: user,
      password: hashedPwd
    };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    console.log(usersDB.users);
    res.status(201).json({ success: `New user ${user} created!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handleNewUser;
