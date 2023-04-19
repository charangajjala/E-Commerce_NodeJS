import j2s from "joi-to-swagger";
import * as userValidator from "../validations/userValidator.js";
import { reqBody, resBody } from "../utils/swagger.js";

const tag = "User";

export const swPostSignUp = {
  summary: "Create the new user",
  tags: [tag],
  requestBody: reqBody(userValidator.postSignUp),
  responses: resBody(userValidator.postSignUp, 201, "User Created"),
};

export const swPostLogin = {
  summary: "Logs in the User",
  tags: [tag],
  requestBody: reqBody(userValidator.postLogin),
  responses: resBody(userValidator.postLogin, 200, "User Logged In"),
};

export const swGetUser = {
  summary: "Get User details by ID",
  tags: ["User"],
  parameters: [
    {
      name: "id",
      in: "path",
      description: "ID of the User",
      required: true,
      type: "string",
      schema: { ...j2s(userValidator.getUser.reqParamSchema).swagger },
    },
  ],
  responses: resBody(userValidator.getUser, 200, "User Fetched"),
};

export const swUserRouter = {
  "/api/admin/user/signup": {
    post: { ...swPostSignUp },
  },
  "/api/admin/user/login": {
    post: { ...swPostLogin },
  },
  "/api/admin/user/:id": {
    get: { ...swGetUser },
  },
  "/api/user/signup": {
    post: { ...swPostSignUp },
  },
  "/api/user/login": {
    post: { ...swPostLogin },
  },
  "/api/user/:id": {
    get: { ...swGetUser },
  },
};
