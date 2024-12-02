import express from "express";
import RequestLog from "../models/requestLog.model.js";
import { auth } from "../middlewares/auth.middleware.js";

const logsRouter = express.Router();

logsRouter.get("/logs", auth("admin"), async (req, res) => {
  const logs = await RequestLog.findAll();
  res.json(logs);
})

export default logsRouter;
