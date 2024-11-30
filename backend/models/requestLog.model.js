import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Account from "./account.model.js";

const RequestLog = sequelize.define("RequestLog", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  account_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Account,
      key: "id",
    }
  },
  method: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endpoint: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status_code: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  client_ip: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  request_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: false,
  tableName: "request_log",
});

export default RequestLog;
