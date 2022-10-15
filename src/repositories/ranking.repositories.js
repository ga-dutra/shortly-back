import connection from "../database/database.js";

async function listRanking() {
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
    return rankingByUser;
  } catch (error) {
    return error.message;
  }
}

export { listRanking };
