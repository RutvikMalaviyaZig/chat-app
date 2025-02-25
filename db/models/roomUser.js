"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const RoomUser = sequelize.define(
  "RoomUsers",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    roomid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Rooms",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
    tableName: "RoomUsers"
  }
);


module.exports = RoomUser;

