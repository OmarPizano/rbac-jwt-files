import express from "express";
import Role from "../models/role.model.js";
import { auth } from "../middlewares/auth.middleware.js";

const roleRouter = express.Router();

// TODO: check for admin role
roleRouter.get("/roles", auth("admin"), async (req, res) => {
  const roles = await Role.findAll();
  res.json(roles);
})

export default roleRouter;
