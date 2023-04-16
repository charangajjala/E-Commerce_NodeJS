import { swSignUpRouter } from "./userSwagger.js";
const swagger = {
  openapi: "3.0.0",
  info: {
    title: "Express API",
    version: "1.0.0",
    description: "The REST API test service",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  paths: {...swSignUpRouter},
};
export default swagger;
