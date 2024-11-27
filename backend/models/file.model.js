import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Role from "./role.model.js";

const File = sequelize.define("File", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role_id_required: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role,
      key: "id",
    }
  },
}, {
  timestamps: false,
  tableName: "uploaded_file",
});

export default File;
