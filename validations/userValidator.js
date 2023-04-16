import Joi from "joi";
import { BaseValidator } from "./baseValidator.js";

export class postSignUp extends BaseValidator {
  static reqSchema = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{8,16}$"))
      .required(),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Confirm password must match the password",
      }),
  });

  static resSchema = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    id: this.ObjectId,
  });
}

export class postLogin extends BaseValidator {
  static reqSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{8,16}$"))
      .required(),
  });

  static resSchema = Joi.object({
    token: Joi.string().required(),
    userId: Joi.string().required(),
  });
}

export class getUser extends BaseValidator {
  static reqParamSchema = Joi.object({
    id: this.ObjectId,
  });
  static resSchema = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
  });
}
