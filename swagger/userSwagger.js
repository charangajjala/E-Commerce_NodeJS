import j2s from "joi-to-swagger";
import * as userValidator from "../validations/userValidator.js";

export const swPostUser = {
  summary: "Create the new user",
  tags: ["Sign Up"],
  requestBody: {
    content: {
      "application/json": {
        schema: { ...j2s(userValidator.postSignUp.reqSchema).swagger },
      },
    },
  },
  responses: {
    201: {
      description: "User created",
      content: {
        "application/json": {
          schema: { ...j2s(userValidator.postSignUp.resSchema).swagger },
        },
      },
    },
    default: {
      description: "Error message",
    },
  },
};

export const swSignUpRouter = {
  "/api/auth/signup": {
    post: { ...swPostUser },
  },
};
