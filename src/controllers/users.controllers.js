import connection from "../database/database.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

async function createNewUser(req, res) {
  const { name, email, password, confirmPassword } = req.body;
  const passwordHash = bcrypt.hashSync(password, 10);

  try {
    await connection.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, passwordHash]
    );
    return res.status(201).send({ message: "User created!" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export { createNewUser };
