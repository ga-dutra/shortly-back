import * as userRepository from "../repositories/users.repositories.js";

async function validateToken(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send({ error: "Authorization is not valid" });
  }

  try {
    const session = await userRepository.getSessionByToken(token);

    if (session.rowCount === 0) {
      return res.status(401).send({ error: "Session not found" });
    }

    const user = await userRepository.getUserByToken(token);

    if (user.rowCount === 0) {
      return res.status(404).send({ error: "User not found" });
    }

    res.locals.userId = user.rows[0].userId;
    res.locals.userName = user.rows[0].name;
    next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export { validateToken };
