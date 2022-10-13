import connection from "../database/database.js";
import { nanoid } from "nanoid";

async function shortUrl(req, res) {
  const { url } = req.body;
  const shortUrl = nanoid(9);
  const userId = res.locals.userId;

  try {
    const existingUrl = await connection.query(
      'SELECT * FROM urls WHERE "userId" = $1 AND "fullUrl" = $2;',
      [userId, url]
    );
    if (existingUrl.rowCount !== 0) {
      return res
        .status(422)
        .send({ error: "Url has already been shorten by the user" });
    }

    await connection.query(
      `INSERT INTO urls ("userId", "fullUrl", "shortUrl") VALUES ($1, $2, $3);`,
      [userId, url, shortUrl]
    );
    return res.status(201).send({ shortUrl: shortUrl });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export { shortUrl };
