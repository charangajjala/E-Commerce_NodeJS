/**
 * Creates an Error object with these params
 * @param {number} statusCode - status code
 * @param {Object} details - {message,data={'key':'errormsg'}}
 * @returns {Error} 
 */
export const sendError = (statusCode, details = {}) => {
  const err = new Error();
  err.statusCode = statusCode;
  err.message = details.message;
  err.data = details.data;
  return err;
};
