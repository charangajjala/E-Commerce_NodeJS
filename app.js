import express from "express";
import bodyParser from "body-parser";
import swaggerUI from "swagger-ui-express";

import startServer from "./config/server.js";
import appRoutes from "./routes/index.js";
import { sendError } from "./utils/error.js";
import { errorMiddleware } from "./middlewares/errroMiddlewares.js";
import swDoc from "./swagger/swagger.js";

const app = express();

app.use(bodyParser.json());
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swDoc))
app.use("/api", appRoutes);

app.use("/", (req, res, next) => {
  throw sendError(404);
});

app.use(errorMiddleware);

startServer(app);
