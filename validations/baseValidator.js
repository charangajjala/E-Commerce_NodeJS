import Joi from "joi";
import { sendError } from "../utils/error.js";

export class BaseValidator {
  static reqSchema;
  static resSchema;
  static reqParamSchema;
  static reqQuerySchema;

  static ObjectId = Joi.string()
    .regex(/^[a-f\d]{24}$/i)
    .required()
    .messages({
      "string.pattern.base": "Needs MongoDB ObjectID ", // Custom error message for invalid ID format
    });

  /**
   * Request Input Validation
   * @returns {middleware}
   */
  static reqValidator() {
    const validatorMiddleware = (req, res, next) => {
      console.log(
        "######################################################################"
      );
      console.log("REQUEST:", req.method, req.originalUrl);
      console.log("Body", req.body);
      console.log("Params", req.params);
      console.log("Query", req.query);

      let finalErrorMessages = {};

      const bodyErros = this.validate(req.body, this.reqSchema);
      const paramErros = this.validate(req.params, this.reqParamSchema);
      const queryErros = this.validate(req.query, this.reqQuerySchema);

      if (bodyErros) finalErrorMessages.bodyErros = bodyErros;
      if (paramErros) finalErrorMessages.paramErros = paramErros;
      if (queryErros) finalErrorMessages.queryErros = queryErros;

      if (Object.keys(finalErrorMessages).length !== 0) {
        throw sendError(422, { data: finalErrorMessages });
      }
      next();
    };
    return validatorMiddleware;
  }

  /**
   * Response Validation
   * @param {Object} result
   * @param {number} statusCode
   * @param {Object}  mongooseSession - Mongoose Transaction Session
   * @returns {Promise<Void>} If response validation succeeds
   * @throws {Error} If validation fails and Roll backs mongoose DB transcations
   */

  static async resValidate(response, statusCode) {
    const { error } = this.resSchema.validate(response, {
      abortEarly: false,
    });
    if (error) {
      console.log("Response Validation Error:");
      console.log(this.extractMessages(error.details));
      throw sendError(500);
    }
    console.log("RESPONSE:");
    console.log(statusCode);
    console.log(response);
    return { response, statusCode };
  }

  static validate(data, schema) {
    if (Object.keys(data).length !== 0) {
      const { error } = schema.validate(data, {
        abortEarly: false,
      });
      if (error) {
        // throw sendError(422, { data: this.extractMessages(error.details) });
        const msgs = this.extractMessages(error.details);
        return msgs;
      }
    }
    return null;
  }
  /**
   * Utility to extract validation messages
   * @param {Object} details
   * @returns {Object}
   */
  static extractMessages(details) {
    const dataObj = {};
    for (const detail of details) {
      dataObj[detail.context.key] = detail.message;
    }
    return dataObj;
  }
}
