/**
 * Controller for handling user-related requests.
 * @module userController
 */
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { User } from "../../models/user.js";
import { sendError } from "../../utils/error.js";
import * as userValidator from "../../validations/userValidator.js";

/**
 * Represents a controller object for a single User Service
 * @class
 */

export class UserService {
  /**
   * Registers new User with hashed password
   * @param {*} req
   * @returns {object}
   * @throws {Error} If user or email already exists
   */
  static singup = async (req) => {
    console.log("<------userContoller.UserService.signup----->");
    let session;
    try {
      session = await mongoose.startSession();
      session.startTransaction();
      const { userName, email, password } = req.body;
      await UserUtility.checkNameEmail(userName, email);
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await User({
        userName,
        email,
        password: hashedPassword,
      }).save({ session });
      const id = newUser._id.toString();
      const response = { userName, email, id };
      const statusCode = 201;
      const result = await userValidator.postSignUp.resValidate(
        response,
        statusCode
      );
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      console.log("Transaction rolled back");
      session.endSession();
      throw error;
    }
  };

  /**
   * Login functionality by validating user credentials and generated token
   * @param {object} req - Express request object.
   * @returns {object} - Return token
   * @throws {Error} - If there is an error during the login process.
   */
  static login = async (req) => {
    console.log("<------userContoller.UserService.login----->");
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw sendError(404, { message: "User with the email doesnt exist" });
    }
    await UserUtility.validateCredentials(user.password, password);
    const userId = user._id.toString();
    const token = jwt.sign({ userId }, "mylongsecretkey", {
      expiresIn: "1h",
    });
    const response = { token, userId };
    const statusCode = 200;
    const result = await userValidator.postLogin.resValidate(
      response,
      statusCode
    );
    return result;
  };

  /**
   * Fetched user details by ID
   * @param {object} req - Express request object.
   * @param {string} Id - req paramter
   * @returns {object} - Returns user details
   * @throws {Error} - If there is an error during  process.
   */
  static getUser = async (req) => {
    console.log("<------userContoller.UserService.getUser----->");
    console.log(req.user);
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      throw sendError(404, { message: "User not found with the ID" });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      // Not the same user, so not authrorized to access other user details
      throw sendError(401);
    }

    const { userName, email } = user;
    const response = { userName, email };
    const statusCode = 200;
    const result = await userValidator.getUser.resValidate(
      response,
      statusCode
    );
    return result;
  };
}

export class UserUtility {
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
