const { DataTypes, Deferrable } = require("sequelize")
const db = require("../index")
const User = require("./user")


const Shop = db.define(
    "Shop",
    {
        botID: {
            type: DataTypes.STRING(30),
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        botToken: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        ownerID: {
            type: DataTypes.STRING(30),
            references: {
                model: User,
                key: "telegramID",
                deferrable: Deferrable.INITIALLY_IMMEDIATE,
            },
        },
    },
    {
        timestamps: true,
    }
)

module.exports = Shop
