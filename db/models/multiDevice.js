"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const MultiDevice = sequelize.define(
  "MultiDevices",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userid:{
        type : DataTypes.UUID,
        references : {
            model : "Users",
            key : "id"
        }
    },
    fcmtoken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deviceType : {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    tableName: "MultiDevices",
    timestamps: true,
  }
);



module.exports = MultiDevice;
