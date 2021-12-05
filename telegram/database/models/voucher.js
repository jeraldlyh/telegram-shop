const { DataTypes, Sequelize, Deferrable } = require("sequelize")
const db = require("../index")
const Shop = require("./shop")


const Voucher = db.define(
    "Voucher",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        code: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        discount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isValid: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        shopID: {
            type: DataTypes.STRING(30),
            references: {
                model: Shop,
                key: "botID",
                deferrable: Deferrable.INITIALLY_IMMEDIATE,
            },
        },
    },
    {
        timestamps: true,
    }
)

module.exports = Voucher
