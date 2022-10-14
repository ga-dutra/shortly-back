import connection from "../database/database.js";

async function listRanking(req, res) {
  try {
    const rankingByUser =
      await connection.query(`SELECT links.id, links.name, links."linksCount", COUNT(urls."userId") AS "visitCount" FROM urls
      JOIN visits ON visits."urlId" = urls.id
      RIGHT JOIN (SELECT users.id, users.name, count(urls."userId") as "linksCount" from users 
      LEFT JOIN urls on users.id = urls."userId"
      GROUP BY urls."userId", users.id, users.name) AS links ON links.id = urls."userId"
      GROUP BY links.id, links.name, links."linksCount"
      ORDER BY "visitCount" DESC
      LIMIT 10;`);
    return res.status(200).send(rankingByUser.rows);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export { listRanking };
