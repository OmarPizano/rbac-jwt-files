import express from "express";
import Role from "../models/role.model.js";
import { auth } from "../middlewares/auth.middleware.js";

const rolesRouter = express.Router();

rolesRouter.get("/roles", auth("admin"), async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json({ data: roles });
  } catch (error) { 
    console.log(`ERROR: find all roles: ${error}`);
    res.status(500).json({ message: "internal server errror" });
  }
});

export default rolesRouter;
