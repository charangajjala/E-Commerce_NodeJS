/**
 * Controller for handling user-related requests.
 * @module userController
 */
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { User } from "../models/user.js";
import { sendError } from "../utils/error.js";

/**
 * Represents a controller object: POST /api/auth/singup.
 * @class
 */

export class postSignUp {
  /**
   * Registers new User with hashed password
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {JSONResponse}
   * @throws {Error} If user or email already exists
   */
  static serve = async (req, res, next) => {
    console.log("<------userContoller.postSignUp.serve----->");
    let session;
    try {
      session = await mongoose.startSession();
      session.startTransaction();
      const { userName, email, password } = req.body;
      await this.checkNameEmail(userName, email);
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await User({
        userName,
        email,
        password: hashedPassword,
      }).save({ session });
      res.mongooseSession = session;
      res.data = { userName, email, id2: newUser._id.toString() };
      res.statusCode = 201;
      next();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return next(error);
    }
  };
  /**
   * Checks if the provided user name and email are already taken.
   * @async
   * @function checkNameEmail
   * @param {string} userName - The user name to check.
   * @param {string} email - The email to check.
   * @throws {Error} - If the user name or email is already taken.
   */
  static checkNameEmail = async (userName, email) => {
    const userWithName = await User.findOne({ userName });
    const errorMsgs = {};
    let notValid = false;
    if (userWithName) {
      errorMsgs.userName = "User Name is taken";
      notValid = true;
    }
    const userWithEmail = await User.findOne({ email });
    if (userWithEmail) {
      errorMsgs.email = "An account with this email already exists";
      notValid = true;
    }
    if (notValid) {
      throw sendError(422, { data: errorMsgs });
    }
  };
}
