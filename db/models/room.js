// id
// name
// createtor id
// createdAt
// updatedAt
// deletedAt
// description


"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Message = require("./message");

const Room = sequelize.define(
    "Rooms",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      creatorid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",  
          key: "id",
        },
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
      tableName: "Rooms",
      timestamps: true,
    }
  );

Room.hasMany(Message, { foreignKey: "roomid" });
Message.belongsTo(Room, { foreignKey: "roomid" });


module.exports = Room