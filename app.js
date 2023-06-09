import express from "express";
import bodyParser from "body-parser";
import swaggerUI from "swagger-ui-express";

import startServer from "./config/server.js";
import {
  router as appRoutes,
  adminRouter as appAdminRoutes,
} from "./routes/index.js";
import { setUpPassport } from "./config/passport.js";
import { sendError } from "./utils/error.js";
import { errorMiddleware } from "./middlewares/errroMiddlewares.js";
import { swagger } from "./swagger/swagger.js";

const app = express();

app.use(bodyParser.json());
setUpPassport(app);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swagger));

app.use("/api", appRoutes);
app.use("/api/admin", appAdminRoutes);

app.use("/", (req, res, next) => {
  throw sendError(404);
});

app.use(errorMiddleware);

startServer(app);
