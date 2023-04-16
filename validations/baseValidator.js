import { sendError } from "../utils/error.js";

export class BaseValidator {
  static reqSchema;
  static resSchema;

  /**
   * Request Input Validation
   * @returns {middleware}
   */
  static reqValidator() {
    const validatorMiddleware = (req, res, next) => {
      console.log("######################################################################");
      console.log("Request:", req.method, req.originalUrl);
      console.log(req.body);
      const { error } = this.reqSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        throw sendError(422, { data: this.extractMessages(error.details) });
      }
      next();
    };
    return validatorMiddleware;
  }

  /**
   * Response Validation
   * @param {Object} res
   * @returns {JSONResponse} If response validation succeeds
   * @throws {Error} If validation fails and Roll backs mongoose DB transcations
   */

  static resValidateSender() {
    const validatorMiddleware = async (req, res, next) => {
      const { error } = this.resSchema.validate(res.data, {
        abortEarly: false,
      });
      const session = res.mongooseSession;
      if (error) {
        console.log("Response Validation Error:");
        console.log(this.extractMessages(error.details));
        if (session) {
          await session.abortTransaction();
          console.log("Respone validation Failed, Aborted Transcation");
          session.endSession();
        }
        return next(sendError(500));
      }
      if (session) {
        await session.commitTransaction();
        console.log("Transaction Comitted");
      }
      console.log("Response:");
      console.log(res.statusCode);
      console.log(res.data);
      return res.status(res.statusCode).json(res.data);
    };
    return validatorMiddleware;
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
