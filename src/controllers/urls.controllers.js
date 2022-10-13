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

async function getUrlById(req, res) {
  const { urlId } = req.params;

  if (!urlId || isNaN(Number(urlId))) {
    return res.status(401).send({ error: "Url sent as params is not valid" });
  }

  try {
    const query = await connection.query(
      `SELECT "id", "shortUrl", "fullUrl" AS url FROM urls WHERE id = $1;`,
      [urlId]
    );

    if (query.rowCount === 0) {
      return res.status(404).send({ error: "Url does not exist" });
    }

    const url = {
      id: query.rows[0].id,
      shortUrl: query.rows[0].shortUrl,
      url: query.rows[0].url,
    };
    return res.status(200).send(url);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function deleteUrlById(req, res) {
  const userId = res.locals.userId;
  const { urlId } = req.params;

  if (!urlId || isNaN(Number(urlId))) {
    return res.status(401).send({ error: "Url sent as params is not valid" });
  }

  try {
    const url = await connection.query(
      `SELECT "id", "userId", "shortUrl", "fullUrl" AS url FROM urls WHERE id = $1;`,
      [urlId]
    );

    if (url.rowCount === 0) {
      return res.status(404).send({ error: "Url does not exist" });
    }

    if (url.rows[0].userId !== userId) {
      return res.status(401).send({ error: "Url does not belong to user" });
    }

    await connection.query("DELETE FROM urls WHERE id = $1;", [urlId]);
    return res.status(204).send({ message: "Url deleted" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function redirectUser(req, res) {
  const { urlId } = req.params;

  if (!urlId || isNaN(Number(urlId))) {
    return res.status(401).send({ error: "Url sent as params is not valid" });
  }
  try {
    const url = await connection.query(
      `SELECT "id", "userId", "shortUrl", "fullUrl" AS url FROM urls WHERE id = $1;`,
      [urlId]
    );

    if (url.rowCount === 0) {
      return res.status(404).send({ error: "Url does not exist" });
    }

    await connection.query(`INSERT INTO visits ("urlId") VALUES ($1);`, [
      urlId,
    ]);
    console.log(url.rows[0].url);
    return res.redirect(url.rows[0].url);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export { shortUrl, getUrlById, deleteUrlById, redirectUser };
