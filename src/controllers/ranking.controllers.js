import connection from "../database/database.js";

async function listRanking(req, res) {
  try {
    const urlList =
      await connection.query(`SELECT urls.id AS "urlId", urls."shortUrl", urls."fullUrl" as url, COUNT(*) AS "visitCount" 
    FROM visits 
    JOIN urls ON urls.id = visits."urlId"
    GROUP BY urls.id
    ORDER BY COUNT(*) DESC
    LIMIT 10;`);
    return res.send(urlList.rows);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export { listRanking };
