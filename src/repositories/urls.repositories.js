import connection from "../database/database.js";

async function findExistingUrl(userId, url) {
  try {
    const existingUrl = await connection.query(
      'SELECT * FROM urls WHERE "userId" = $1 AND "fullUrl" = $2;',
      [userId, url]
    );
    return existingUrl;
  } catch (error) {
    return error.message;
  }
}

async function insertNewUrl(userId, url, shortUrl) {
  try {
    await connection.query(
      `INSERT INTO urls ("userId", "fullUrl", "shortUrl") VALUES ($1, $2, $3);`,
      [userId, url, shortUrl]
    );
  } catch (error) {
    return error.message;
  }
}

async function getUrl(urlId) {
  try {
    const url = await connection.query(
      `SELECT "id", "userId", "shortUrl", "fullUrl" AS url FROM urls WHERE id = $1;`,
      [urlId]
    );
    return url;
  } catch (error) {
    return error.message;
  }
}

async function deleteUrl(urlId) {
  try {
    const response = await connection.query("DELETE FROM urls WHERE id = $1;", [
      urlId,
    ]);
    return response;
  } catch (error) {
    return error.message;
  }
}

async function postVisit(urlId) {
  try {
    const response = await connection.query(
      `INSERT INTO visits ("urlId") VALUES ($1);`,
      [urlId]
    );
    return response;
  } catch (error) {
    return error.message;
  }
}

export { findExistingUrl, insertNewUrl, getUrl, deleteUrl, postVisit };
