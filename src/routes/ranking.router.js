import express from "express";
import { listRanking } from "../controllers/ranking.controllers.js";

const router = express.Router();

router.get("/ranking", listRanking);

export default router;
