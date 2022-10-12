import express from "express";
import { createNewUser } from "../controllers/users.controllers.js";
import { validateNewUser } from "../middlewares/users.middlewares.js";

const router = express.Router();

router.post("/signup", validateNewUser, createNewUser);

export default router;
