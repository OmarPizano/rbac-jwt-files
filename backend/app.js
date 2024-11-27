import express from "express";
import sequelize from "./config/db.js";
import roleRouter from "./routes/role.routes.js";

const app = express();

// middlewares
app.use(express.json());

// routes
app.use(roleRouter);

// database sync
sequelize.sync().then(() => {
  console.log("DB READY!");
})

// start server
app.listen(process.env.PORT, () => {
  console.log(`SERVER READY ON PORT ${process.env.PORT}`);
})
