const { Sequelize, DataTypes, Deferrable } = require("sequelize")
const db = require("../index")
const User = require("./user")


const Address = db.define(
    "Address",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        userID: {
            type: DataTypes.STRING(30),
            references: {
                model: User,
                key: "telegramID",
                deferrable: Deferrable.INITIALLY_IMMEDIATE,
            },
        },
        addressLineOne: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        addressLineTwo: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        mobile: {
            type: DataTypes.STRING(30),
            unique: true,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        postalCode: {
            type: DataTypes.STRING(16),
            allowNull: false,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = Address
