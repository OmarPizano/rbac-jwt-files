import express from "express";
import sequelize from "./config/db.js";
import roleRouter from "./routes/role.routes.js";
import authRouter from "./routes/auth.routes.js";
import logsRouter from "./routes/log.routes.js";
import accountsRouter from "./routes/account.routes.js";
import filesRouter from "./routes/file.routes.js";
import { requestLogger } from "./middlewares/log.middleware.js";

const app = express();

// common middlewares
app.use(express.json());
app.use(requestLogger)

// routes
app.get("/", (req, res) => {
  res.status(200).json({message: "API: RBAC JWT FILES"});
})
app.use(authRouter);
app.use(roleRouter);
app.use(logsRouter);
app.use(accountsRouter)
app.use(filesRouter);
app.use((req, res) => {
  res.status(404).json({message: "not found"});
});

// database sync
sequelize.sync().then(() => {
  console.log("DB READY!");
})

// start server
app.listen(process.env.PORT, () => {
  console.log(`SERVER READY ON PORT ${process.env.PORT}`);
})
