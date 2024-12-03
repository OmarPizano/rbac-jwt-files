import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from "bcrypt";
import Role from "./role.model.js";

const Account = sequelize.define("Account", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role_id: {
    type: DataTypes.INTEGER,
    defaultValue: 2,
    allowNull: false,
    references: {
      model: Role,
      key: "id",
    }
  }
}, {
  timestamps: false,
  tableName: "account",
});

// hooks for password encryption
Account.beforeCreate(
  async (account) => {
    const salt = await bcrypt.genSalt(10);
    account.password = await bcrypt.hash(account.password, salt);
  }
);
Account.beforeUpdate(
  async (account) => {
    if (account.changed("password")) {
      const salt = await bcrypt.genSalt(10);
      account.password = await bcrypt.hash(account.password, salt);
    }
  }
);

export default Account;
