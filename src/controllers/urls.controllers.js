import { nanoid } from "nanoid";
import * as urlsRepository from "../repositories/urls.repositories.js";

async function shortUrl(req, res) {
  const { url } = req.body;
  const shortUrl = nanoid(9);
  const userId = res.locals.userId;

  try {
    const existingUrl = await urlsRepository.findExistingUrl(userId, url);

    if (existingUrl.rowCount !== 0) {
      return res
        .status(422)
        .send({ error: "Url has already been shorten by the user" });
    }

    await urlsRepository.insertNewUrl(userId, url, shortUrl);

    return res.status(201).send({ shortUrl: shortUrl });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function getUrlById(req, res) {
  const { urlId } = req.params;

  if (!urlId || isNaN(Number(urlId))) {
    return res.status(401).send({ error: "Url sent as params is not valid" });
  }

  try {
    const urlQuery = await urlsRepository.getUrl(urlId);

    if (urlQuery.rowCount === 0) {
      return res.status(404).send({ error: "Url does not exist" });
    }

    const url = {
      id: urlQuery.rows[0].id,
      shortUrl: urlQuery.rows[0].shortUrl,
      url: urlQuery.rows[0].url,
    };
    return res.status(200).send(url);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function deleteUrlById(req, res) {
  const userId = res.locals.userId;
  const { urlId } = req.params;

  if (!urlId || isNaN(Number(urlId))) {
    return res.status(401).send({ error: "Url sent as params is not valid" });
  }

  try {
    const urlQuery = await urlsRepository.getUrl(urlId);

    if (urlQuery.rowCount === 0) {
      return res.status(404).send({ error: "Url does not exist" });
    }
    console.log(urlQuery.rows[0]);
    if (urlQuery.rows[0].userId !== userId) {
      return res.status(401).send({ error: "Url does not belong to user" });
    }
    await urlsRepository.deleteUrl(urlId);
    return res.status(204).send({ message: "Url deleted" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function redirectUser(req, res) {
  const { urlId } = req.params;

  if (!urlId || isNaN(Number(urlId))) {
    return res.status(401).send({ error: "Url sent as params is not valid" });
  }
  try {
    const urlQuery = await urlsRepository.getUrl(urlId);

    if (urlQuery.rowCount === 0) {
      return res.status(404).send({ error: "Url does not exist" });
    }

    await urlsRepository.postVisit(urlId);

    return res.redirect(urlQuery.rows[0].url);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export { shortUrl, getUrlById, deleteUrlById, redirectUser };
