import { urlSchema } from "../models/urls.schemas.js";

async function validateUrl(req, res, next) {
  const { url } = req.body;
  if (!url) {
    return res.status(422).send({ error: "Url is required" });
  }

  const urlValidation = urlSchema.validate({ url: url }, { abortEarly: false });

  if (urlValidation.error) {
    const errors = urlValidation.error.details.map(
      (details) => details.message
    );
    return res.status(422).send(errors);
  }

  const httpRegex =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

  if (!httpRegex.test(url)) {
    return res.status(422).send({ error: "Url is not valid" });
  }

  next();
}

export { validateUrl };
