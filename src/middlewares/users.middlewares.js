import connection from "../database/database.js";
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

export { validateNewUser };
