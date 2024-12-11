import express from "express";
import jwt from "jsonwebtoken"
import jwtConfig from "../config/jwt.js";
import bcrypt from "bcrypt";
import Account from "../models/account.model.js";

const authRouter = express.Router();

authRouter.post("/auth", async (req, res) => {
  try {
    const { username, password } = req.body;

    // validate params
    if (!username || !password) return res.status(400).json({ message: "missing username or password" });

    // search account
    const account = await Account.findOne({ where: { username: username } });
    if (!account) return res.status(401).json({ message: "invalid credentials" });

    // verify password
    if (! await bcrypt.compare(password, account.password)) return res.status(401).json({ message: "invalid credentials" });

    // create token
    // NOTE: using parseInt because: 3600 = '1h', '3600' = 3.6 seconds
    const token = jwt.sign({
      id: account.id,
      username: account.username,
      role_id: account.role_id,
    }, jwtConfig.secret, { expiresIn: parseInt(jwtConfig.expiresIn, 10) }); 

    res.status(200).json({ data: token });
  } catch (error) {
    console.log(`ERROR: authentication: ${error}`);
    res.status(500).json({ message: "internal server errror" });
  }
});

export default authRouter;
