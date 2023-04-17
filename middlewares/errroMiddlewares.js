/**
 * Default error handler middleware
 * @param {Object} err
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {JSONResponse} JSON Response
 */
export const errorMiddleware = (err, req, res, next) => {
  console.error("Got", err);
  let statusCode = err.statusCode || err.status;
  let message = err.message;
  const data = err.data;
  const validCodes = [400, 401, 422, 404, 500];

  if (!statusCode || !validCodes.includes(statusCode)) {
    statusCode = 500;
    message = "Internal Server Error";
  }
  if (!message) {
    if (statusCode === 400) {
      message = "Bad Request"; // Bad request other than validation errors
    }
    if (statusCode === 422) {
      // validation errors
      message = "Validation Error";
    }
    if (statusCode === 401) {
      message = "Not Authorized";
    }
    if (statusCode === 404) {
      message = "Not Found ";
    }
    if (statusCode === 500) {
      message = "Internal Server Error";
    }
  }
  // console.log("Response:", { statusCode, message });
  console.log("RESPONSE:");
  if (statusCode === 422) {
    console.log(statusCode);
    console.log({ message, data });
    return res.status(statusCode).json({ message, data });
  }
  console.log(statusCode);
  console.log({ message });
  res.status(statusCode).json({ message });
};
