import express from "express";
import RequestLog from "../models/requestLog.model.js";
import { auth } from "../middlewares/auth.middleware.js";

const logsRouter = express.Router();

logsRouter.get("/logs", auth("admin"), async (req, res) => {
  try {  
    const logs = await RequestLog.findAll();
    res.status(200).json({ data: logs });
  } catch (error) { 
    console.log(`ERROR: ${req.method} ${req.originalUrl}: ${error}`);
    res.status(500).json({ message: "internal server errror" });
  }
});

export default logsRouter;
