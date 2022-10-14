import connection from "../database/database.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

async function createNewUser(req, res) {
  const { name, email, password, confirmPassword } = req.body;
  const passwordHash = bcrypt.hashSync(password, 10);

  try {
    await connection.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3);",
      [name, email, passwordHash]
    );
    return res.status(201).send({ message: "User created!" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function postLogin(req, res) {
  const user = res.locals.user;
  const token = uuid();
  const sessionType = "login";
  try {
    await connection.query(
      `INSERT INTO sessions ("userId", token, type) VALUES ($1, $2, $3);`,
      [user.id, token, sessionType]
    );
    return res.status(200).send({ token: token });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function listUserLinks(req, res) {
  const userId = res.locals.userId;
  const userName = res.locals.userName;
  let userVisitCount = 0;
  try {
    const allUserLinks = await connection.query(
      'SELECT "id" AS "urlId", "shortUrl", "fullUrl" as url FROM urls WHERE ("userId") = $1;',
      [userId]
    );

    const visitedUserLinks = await connection.query(
      `SELECT urls.id AS "urlId", COUNT(*) AS "visitCount" 
    FROM visits 
    JOIN urls ON urls.id = visits."urlId"
    JOIN users ON users.id = urls."userId"
    WHERE "userId" = $1
    GROUP BY urls.id;`,
      [userId]
    );

    const model = [];
    allUserLinks.rows.forEach((obj) => {
      model.push({
        id: obj.urlId,
        shortUrl: obj.shortUrl,
        url: obj.url,
        visitCount: 0,
      });
    });
    visitedUserLinks.rows.forEach((obj) => {
      model.forEach((element) => {
        if (element.id === obj.urlId) {
          element.visitCount = Number(obj.visitCount);
          userVisitCount += Number(obj.visitCount);
        }
      });
    });
    const body = {
      id: userId,
      name: userName,
      visitCount: userVisitCount,
      shortenedUrls: model,
    };
    return res.status(200).send(body);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export { createNewUser, postLogin, listUserLinks };
