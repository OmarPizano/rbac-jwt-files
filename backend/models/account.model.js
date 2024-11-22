import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from "bcrypt";

const Account = sequelize.define("Account", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "user"),
    defaultValue: "user",
    allowNull: false,
  }
}, {
  timestamps: false,
  tableName: "account",
});

// Hook for password encryption
Account.beforeCreate(
  async (account) => {
    const salt = await bcrypt.genSalt(10);
    account.password = await bcrypt.hash(account.password, salt);
  }
);

export default Account;
