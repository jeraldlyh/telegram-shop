const { Sequelize, DataTypes, Deferrable } = require("sequelize")
const db = require("../index")
const Shop = require("./shop")


const Category = db.define(
    "Category",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(100),
            allowNull: null,
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

module.exports = Category
