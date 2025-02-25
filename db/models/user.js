"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Room = require('./room')
const Message = require('./message')

const User = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: "email is required",
        },
        notEmpty: {
          msg: "email is required",
        },
        isEmail: {
          msg: "Invalid email",
        },
      },
    },
    mobile: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      validate: {
        len: {
          args: [10, 10],
          msg: "Mobile number must be 10 digits",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: "Users",
    timestamps: true,
  }
);


User.hasMany(Room, { foreignKey: "creatorid" });
Room.belongsTo(User, { foreignKey: "creatorid" });

User.hasMany(Message, { foreignKey: "senderid" });
Message.belongsTo(User, { foreignKey: "senderid" });


module.exports = User;
