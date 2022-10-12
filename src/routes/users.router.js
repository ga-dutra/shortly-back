import express from "express";
import { createNewUser, postLogin } from "../controllers/users.controllers.js";
import {
  validateNewUser,
  validateLogin,
} from "../middlewares/users.middlewares.js";

const router = express.Router();

router.post("/signup", validateNewUser, createNewUser);
router.post("/signin", validateLogin, postLogin);

export default router;
