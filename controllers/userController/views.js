import { UserService } from "./services.js";

/**
 * API: /api/user/:id
 * Methods allowed: GET,
 */
export class UserAPI {
  // Gets user details by ID
  static async get(req, res, next) {
    try {
      const { response, statusCode } = await UserService.getUser(req);
      return res.status(statusCode).json(response);
    } catch (error) {
      return next(error);
    }
  }
}

/**
 * API: /api/admin/user/:id
 * Methods allowed: GET,
 */
export class AdminUserAPI {
  // Gets user details by ID
  static async get(req, res, next) {
    try {
      const { response, statusCode } = await UserService.getUser(req);
      return res.status(statusCode).json(response);
    } catch (error) {
      return next(error);
    }
  }
}

/**
 * Methods allowed: GET, POST
 */
export class AuthAPI {
  /**
   * Signs up the user
   * POST: /api/user/singup
   */
  static async postSignUp(req, res, next) {
    try {
      const { response, statusCode } = await UserService.singup(req);
      return res.status(statusCode).json(response);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Logsin the user
   * POST: /api/user/login
   */
  static async postLogin(req, res, next) {
    try {
      const { response, statusCode } = await UserService.login(req);
      return res.status(statusCode).json(response);
    } catch (error) {
      return next(error);
    }
  }
}
