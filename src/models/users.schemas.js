import joi from "joi";

const newUserSchema = joi.object({
  name: joi.string().empty(" ").required(),
  email: joi.string().email().required(),
  password: joi.string().empty(" ").required(),
  confirmPassword: joi.valid(joi.ref("password")).required(),
});

const userLoginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().empty(" ").required(),
});

export { newUserSchema, userLoginSchema };
