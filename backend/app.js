import express from "express";
import sequelize from "./config/db.js";
import fileRouter from "./routes/file.routes.js";

const app = express();

// middlewares
app.use(express.json());

// routes
app.use(fileRouter);

// database sync
sequelize.sync().then(() => {
  console.log("DB READY!");
})

// start server
app.listen(process.env.PORT, () => {
  console.log(`SERVER READY ON PORT ${process.env.PORT}`);
})
