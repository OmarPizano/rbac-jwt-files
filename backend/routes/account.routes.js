import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import Account from "../models/account.model.js";

const accountsRouter = express.Router();

accountsRouter.get("/accounts", auth("admin"), async (req, res) => {
  try {
    const accounts = await Account.findAll({ attributes: ['id', 'username', 'role_id'] });
    res.status(200).json({ data: accounts });  
  } catch (error) {
    console.log(`ERROR: ${req.method} ${req.originalUrl}: ${error}`);
    res.status(500).json({ message: "internal server errror" }); 
  }
});

accountsRouter.post("/accounts", auth("admin"), async (req, res) => {
  // validate params
  const { username, password, role_id } = req.body;
  if ( !username || !password || !role_id ) return res.status(400).json({ message: "expected parameters: username, password, role_id" });

  try {
    // check username availability
    const accounts = await Account.findAll({ where: { username: username } });
    if ( accounts.length !== 0 ) return res.status(409).json({ message: "user unavailable" });

    // create account  
    const created_account = await Account.create({ username, password, role_id });

    return res.status(201).json({ data: created_account }); 
  } catch (error) {
    console.log(`ERROR: ${req.method} ${req.originalUrl}: ${error}`);
    res.status(500).json({ message: "internal server errror" }); 
  }
});

// TODO: separte this endpoint in two: 1. change current user password (any user), 2. change other's password (only admin)
accountsRouter.patch("/accounts/:id", auth("admin", "user"), async (req, res) => {
  try {
    // user: can only change his password
    if (req.accountData.role_id == 2) {

      // verify the user is changing his password
      if (req.params.id !== req.accountData.id) return res.status(403).json({ message: "normal accounts can only change its password" });

      // validate params
      const { password } = req.body;
      if ( !password ) return res.status(400).json({ message: "expected parameters: password" });

      // check account existence
      const account = await Account.findByPk(req.params.id);
      if ( !account ) return res.status(404).json({ message: "account not found" });

      // change password
      account.password = password;
      await account.save();

      return res.sendStatus(204);
    }
    // admin: can change password and role_id of any account
    if (req.accountData.role_id == 1) {

      // validate params
      const { password, role_id } = req.body;
      // client must specify at least one
      if ( !password && !role_id ) return res.status(400).json({ message: "expected parameters: password, role_id" });

      // an admin can demote other admins but not himself
      // because there must be at least one admin
      if ( role_id === 2 && req.params.id === req.accountData.id ) return res.status(403).json({ message: "an admin cannot demote himself" });

      // check account existence
      const account = await Account.findByPk(req.params.id);
      if ( !account ) return res.status(404).json({ message: "account not found" });
      
      // update user's password and/or role_id
      if ( password ) account.password = password;
      if ( role_id ) account.role_id = role_id;
      await account.save();

      return res.sendStatus(204);
    }
  } catch (error) {
    console.log(`ERROR: ${req.method} ${req.originalUrl}: ${error}`);
    res.status(500).json({ message: "internal server errror" }); 
  }
});

accountsRouter.delete("/accounts/:id", auth("admin"), async (req, res) => {
  try {
    // an admin can delete other but not himself
    // because there must be at least one admin
    if ( req.params.id === req.accountData.id ) return res.status(403).json({ message: "an admin cannot delete himself" });

    // check account existence
    const account = await Account.findByPk(req.params.id);
    if ( !account ) return res.status(404).json({ message: "account not found" });

    // delete account
    await account.destroy();

    res.sendStatus(204); 
  } catch (error) {
    console.log(`ERROR: ${req.method} ${req.originalUrl}: ${error}`);
    res.status(500).json({ message: "internal server errror" }); 
  }
});

export default accountsRouter;
