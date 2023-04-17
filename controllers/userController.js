/**
 * Controller for handling user-related requests.
 * @module userController
 */
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { User } from "../models/user.js";
import { sendError } from "../utils/error.js";

/**
 * Represents a controller object: POST /api/singup.
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
      const id = newUser._id.toString();
      res.mongooseSession = session;
      res.data = { userName, email, id };
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

/**
 * Represents a controller object: POST /api/login.
 * @class
 */
export class postLogin {
  /**
   * Login functionality by validating user credentials and generated token
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next function.
   * @returns {JSONResponse} - Return token
   * @throws {Error} - If there is an error during the login process.
   */
  static serve = async (req, res, next) => {
    console.log("<------userContoller.postLogin.serve----->");
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return next(
          sendError(404, { message: "User with the email doesnt exist" })
        );
      }
      await this.validateCredentials(user.password, password);
      const userId = user._id.toString();
      const token = await jwt.sign({ userId }, "mylongsecretkey", {
        expiresIn: "1h",
      });
      res.data = { token, userId };
      res.statusCode = 200;
      next();
    } catch (error) {
      return next(error);
    }
  };
  /**
   * Validates user credentials by comparing hashed password with the provided password.
   * @param {string} hashedPassword - The hashed password stored in the database.
   * @param {string} password - The password provided by the user for validation.
   * @returns {Promise<void>} - A promise that resolves if the provided password is valid.
   * @throws {Error} - If the provided password is invalid.
   */
  static validateCredentials = async (hashedPassword, password) => {
    const isValid = await bcrypt.compare(password, hashedPassword);
    if (!isValid) {
      throw sendError(401);
    }
  };
}

/**
 * Represents a controller object: POST /api/user/:id
 * @class
 */
export class getUser {
  /**
   * Fetched user details by ID
   * @param {Object} req - Express request object.
   * @param {string} Id - req paramter
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next function.
   * @returns {JSONResponse} - Return token
   * @throws {Error} - If there is an error during  process.
   */
  static serve = async (req, res, next) => {
    console.log("<------userContoller.getUser.serve----->");
    // console.log('user',req.user);
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return next(sendError(404, { message: "User not found with the ID" }));
      }
      const { userName, email } = user;
      res.data = { userName, email };
      res.statusCode = 200;
      next();
    } catch (error) {
      return next(error);
    }
  };
}
