import express from "express";
import cors from "cors";
import dotenv from "dotenv";
const app = express();

import usersRouter from "./routes/users.router.js";

dotenv.config();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.use("", usersRouter);

app.listen(PORT, () => {
  console.log("Server is listening on port", PORT);
});
