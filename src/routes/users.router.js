import express from "express";
import {
  createNewUser,
  postLogin,
  listUserLinks,
} from "../controllers/users.controllers.js";
import {
  validateNewUser,
  validateLogin,
} from "../middlewares/users.middlewares.js";
import { validateToken } from "../middlewares/token.middlewares.js";

const router = express.Router();

router.post("/signup", validateNewUser, createNewUser);
router.post("/signin", validateLogin, postLogin);
router.get("/users/me", validateToken, listUserLinks);

export default router;
