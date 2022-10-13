import connection from "../database/database.js";

async function validateToken(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.replace("Bearer ", "");
  console.log(token);
  if (!token) {
    return res.status(401).send({ error: "Authorization is not valid" });
  }

  try {
    const session = await connection.query(
      `SELECT * FROM sessions WHERE token = $1;`,
      [token]
    );
    if (session.rowCount === 0) {
      return res.status(401).send({ error: "Session not found" });
    }

    const userId = await connection.query(
      `SELECT "userId" FROM sessions WHERE token = $1;`,
      [token]
    );

    res.locals.userId = userId.rows[0].userId;
    next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export { validateToken };
