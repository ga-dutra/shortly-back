import connection from "../database/database.js";

async function findExistingUser(email) {
  try {
    const existingUser = await connection.query(
      `SELECT * FROM users WHERE email = $1;`,
      [email]
    );
    return existingUser;
  } catch (error) {
    return error.message;
  }
}

async function insertNewUser(name, email, passwordHash) {
  try {
    const response = await connection.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3);",
      [name, email, passwordHash]
    );
    return response;
  } catch (error) {
    return error.message;
  }
}

async function insertActiveSession(userId, token) {
  try {
    const response = await connection.query(
      `INSERT INTO active_sessions ("userId", token) VALUES ($1, $2);`,
      [userId, token]
    );
    return response;
  } catch (error) {
    return error.message;
  }
}

async function insertHistorySession(userId) {
  try {
    const response = await connection.query(
      `INSERT INTO history_sessions ("userId") VALUES ($1);`,
      [userId]
    );
    return response;
  } catch (error) {
    return error.message;
  }
}

async function listUserLinks(userId) {
  try {
    const allUserLinks = await connection.query(
      'SELECT "id" AS "urlId", "shortUrl", "fullUrl" as url FROM urls WHERE ("userId") = $1;',
      [userId]
    );
    return allUserLinks;
  } catch (error) {
    return error.message;
  }
}

async function listVisitedUserLinks(userId) {
  try {
    const visitedUserLinks = connection.query(
      `SELECT urls.id AS "urlId", COUNT(*) AS "visitCount" 
    FROM visits 
    JOIN urls ON urls.id = visits."urlId"
    JOIN users ON users.id = urls."userId"
    WHERE "userId" = $1
    GROUP BY urls.id;`,
      [userId]
    );
    return visitedUserLinks;
  } catch (error) {
    return error.message;
  }
}

async function getSessionByToken(token) {
  try {
    const session = await connection.query(
      `SELECT * FROM active_sessions WHERE token = $1;`,
      [token]
    );
    return session;
  } catch (error) {
    return error.message;
  }
}

async function getUserByToken(token) {
  try {
    const user = await connection.query(
      `SELECT active_sessions."userId", users."name" FROM active_sessions JOIN users ON users.id = active_sessions."userId" WHERE token = $1;`,
      [token]
    );
    return user;
  } catch (error) {
    return error.message;
  }
}

export {
  findExistingUser,
  insertNewUser,
  insertActiveSession,
  insertHistorySession,
  listUserLinks,
  listVisitedUserLinks,
  getSessionByToken,
  getUserByToken,
};
