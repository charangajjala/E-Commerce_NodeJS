import j2s from "joi-to-swagger";

export const reqBody = (action) => {
  return {
    content: {
      "application/json": {
        schema: { ...j2s(action.reqSchema).swagger },
      },
    },
  };
};

export const resBody = (action, code, desc) => {
  return {
    [code]: {
      description: desc,
      content: {
        "application/json": {
          schema: { ...j2s(action.resSchema).swagger },
        },
      },
    },
    default: {
      description: "Corresponding Error message",
    },
  };
};
