import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import * as userRepository from "../repositories/users.repositories.js";

async function createNewUser(req, res) {
  const { name, email, password } = req.body;
  const passwordHash = bcrypt.hashSync(password, 10);

  try {
    await userRepository.insertNewUser(name, email, passwordHash);
    return res.status(201).send({ message: "User created!" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function postLogin(req, res) {
  const user = res.locals.user;
  const token = uuid();

  try {
    await userRepository.insertActiveSession(user.id, token);
    await userRepository.insertHistorySession(user.id);
    return res.status(200).send({ token: token });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function listUserLinks(req, res) {
  const userId = res.locals.userId;
  const userName = res.locals.userName;
  let userVisitCount = 0;
  try {
    const allUserLinks = await userRepository.listUserLinks(userId);
    const visitedUserLinks = await userRepository.listVisitedUserLinks(userId);

    const model = [];
    allUserLinks.rows.forEach((obj) => {
      model.push({
        id: obj.urlId,
        shortUrl: obj.shortUrl,
        url: obj.url,
        visitCount: 0,
      });
    });
    visitedUserLinks.rows.forEach((obj) => {
      model.forEach((element) => {
        if (element.id === obj.urlId) {
          element.visitCount = Number(obj.visitCount);
          userVisitCount += Number(obj.visitCount);
        }
      });
    });
    const body = {
      id: userId,
      name: userName,
      visitCount: userVisitCount,
      shortenedUrls: model,
    };
    return res.status(200).send(body);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export { createNewUser, postLogin, listUserLinks };
