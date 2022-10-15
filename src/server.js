import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

import usersRouter from "./routes/users.router.js";
import urlsRouter from "./routes/urls.router.js";
import rankingRouter from "./routes/ranking.router.js";
import sessionCheck from "./utils/sessionCheck.js";

dotenv.config();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.use("/auth", usersRouter);
app.use("/urls", urlsRouter);
app.use("", rankingRouter);

// setInterval(sessionCheck, 1000 * 20);

app.listen(PORT, () => {
  console.log("Server is listening on port", PORT);
});
