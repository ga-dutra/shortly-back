import express from "express";
import {
  shortUrl,
  getUrlById,
  deleteUrlById,
} from "../controllers/urls.controllers.js";
import { validateUrl } from "../middlewares/urls.middlewares.js";
import { validateToken } from "../middlewares/token.middlewares.js";

const router = express.Router();

router.post("/shorten", validateToken, validateUrl, shortUrl);
router.get("/:urlId", getUrlById);
router.delete("/:urlId", validateToken, deleteUrlById);

export default router;
