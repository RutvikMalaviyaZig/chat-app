"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Message = sequelize.define(
    "Messages",
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        senderid: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Users",
                key: "id"
            }
        },
        receiverid: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "Users",
                key: "id"
            }
        },
        roomid: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "Rooms",
                key: "id"
            }
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
        tableName: "Messages",
        timestamps: true,
    }
);


module.exports = Message;


