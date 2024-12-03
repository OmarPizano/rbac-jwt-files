import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import Account from "../models/account.model.js";

const accountsRouter = express.Router();

accountsRouter.get("/accounts", auth("admin"), async (req, res) => {
  const accounts = await Account.findAll({ attributes: ['id', 'username', 'role_id'] });
  res.json(accounts);
});

accountsRouter.post("/accounts", auth("admin"), async (req, res) => {
  // validate params
  const { username, password, role_id } = req.body;

  if ( !username || !password || !role_id ) return res.sendStatus(400);

  try {
    // check username existence
    const accounts = await Account.findAll({ where: { username: username } });
    if ( accounts.length !== 0 ) return res.status(409).json({ "message": "user already exists" })

    // create account  
    const result = await Account.create({ username, password, role_id });

    return res.sendStatus(201);
    
  } catch (error) {
    console.log(`ERROR: create account: ${error}`);
    res.sendStatus(500);
  }
});

// TODO: the admin account must be always role_id = 1
accountsRouter.patch("/accounts/:id", auth("admin", "user"), async (req, res) => {
  try {
    // user: can change ITS password
    if (req.accountData.role_id == 2) {
      // verify the user is changing ITS password
      if (req.params.id !== req.accountData.id) return res.sendStatus(403);

      // validate params
      const { password } = req.body;
      if ( !password ) return res.sendStatus(400);

      // update user's password
      const account = await Account.findByPk(req.params.id);
      if ( !account ) return res.sendStatus(404);
      account.password = password;
      await account.save();

      return res.sendStatus(204);
    }
    // admin: can change password and role_id of ANY ACCOUNT
    if (req.accountData.role_id == 1) {

      // validate params
      const { password, role_id } = req.body;
      // client must specify at least one
      if ( !password && !role_id ) return res.sendStatus(400);

      // update user's password and/or role_id
      const account = await Account.findByPk(req.params.id);
      if ( !account ) return res.sendStatus(404);
      if ( password ) account.password = password;
      if ( role_id ) account.role_id = role_id;
      await account.save();

      return res.sendStatus(204);
    }
  } catch (error) {
    console.log(`ERROR: update account: ${error}`);
    res.sendStatus(500);
  }
});

// TODO: the admin account must always exist
accountsRouter.delete("/accounts/:id", auth("admin"), async (req, res) => {
  try {
    const account = await Account.findByPk(req.params.id);
    if ( !account ) return res.sendStatus(404);

    await account.destroy();
    res.sendStatus(204);
    
  } catch (error) {
    console.log(`ERROR: delete account: ${error}`);
    res.sendStatus(500);
  }
});

export default accountsRouter;
