const { DataTypes, Deferrable } = require("sequelize")
const db = require("../index")
const User = require("./user")
const Shop = require("./shop")


const Chat = db.define(
    "Chat",
    {
        userID: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "telegramID",
                deferrable: Deferrable.INITIALLY_IMMEDIATE,
            },
        },
        shopID: {
            type: DataTypes.INTEGER,
            references: {
                model: Shop,
                key: "botID",
                deferrable: Deferrable.INITIALLY_IMMEDIATE,
            },
        },
        chatID: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: true,
    }
)

module.exports = Chat
