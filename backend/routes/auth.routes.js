import express from "express";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import Account from "../models/account.model.js";

const authRouter = express.Router();

authRouter.post("/auth/token", async (req, res) => {
  const { username, password } = req.body;

  // search account
  const account = await Account.findOne({ where: { username: username } });

  // verify password
  if (! await bcrypt.compare(password, account.password)) return res.sendStatus(401);

  // create token
  const token = jwt.sign({
    id: account.id,
    username: account.username,
    role_id: account.role_id,
  }, process.env.JWT_SECRET, { expiresIn: "1h" }); 
  res.json({ token });
})

export default authRouter;
