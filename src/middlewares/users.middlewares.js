import connection from "../database/database.js";
import bcrypt from "bcrypt";
import { newUserSchema, userLoginSchema } from "../models/users.schemas.js";

async function validateNewUser(req, res, next) {
  const newUser = req.body;

  const newUserValidation = newUserSchema.validate(newUser, {
    abortEarly: false,
  });

  if (newUserValidation.error) {
    const errors = newUserValidation.error.details.map(
      (details) => details.message
    );
    return res.status(422).send(errors);
  }

  try {
    const existingUser = await connection.query(
      `SELECT * FROM users WHERE email = $1`,
      [req.body.email]
    );

    if (existingUser.rowCount !== 0) {
      return res.status(409).send({ error: "User already exists!" });
    }

    next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function validateLogin(req, res, next) {
  const { email, password } = req.body;
  let passwordIsValid = undefined;
  const loginValidation = userLoginSchema.validate(req.body, {
    abortEarly: false,
  });

  if (loginValidation.error) {
    const errors = loginValidation.error.details.map(
      (details) => details.message
    );
    return res.status(422).send(errors);
  }

  try {
    const existingUser = await connection.query(
      `
      SELECT * FROM users WHERE email = $1;`,
      [email]
    );
    if (existingUser.rowCount !== 0) {
      passwordIsValid = bcrypt.compareSync(
        password,
        existingUser.rows[0].password
      );
    }
    if (existingUser.rowCount !== 0 && passwordIsValid) {
      res.locals.user = existingUser.rows[0];
      next();
    } else {
      return res.status(401).send({ error: "E-mail or password are invalid" });
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
export { validateNewUser, validateLogin };
