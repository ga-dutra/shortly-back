import * as rankingRepository from "../repositories/ranking.repositories.js";

async function listRanking(req, res) {
  try {
    const rankingByUser = await rankingRepository.listRanking();
    return res.status(200).send(rankingByUser.rows);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export { listRanking };
