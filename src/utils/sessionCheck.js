import connection from "../database/database.js";

export default async function sessionCheck() {
  const nowTime = new Date();

  try {
    const allSessions = await connection.query("SELECT * FROM active_sessions");
    allSessions.rows.forEach((item) => {
      const hourDiff =
        (nowTime.getTime() - item.createdAt) / 1000 / 60 / 60 + 3;
      if (hourDiff > 1) {
        connection.query(`DELETE FROM active_sessions WHERE id = $1`, [
          item.id,
        ]);
      }
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
