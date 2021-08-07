const { Sequelize, DataTypes, Deferrable } = require("sequelize")
const db = require("../index")
const Order = require("./order")


const Payment = db.define(
    "Payment",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        orderID: {
            type: DataTypes.UUID,
            references: {
                model: Order,
                key: "id",
                deferrable: Deferrable.INITIALLY_IMMEDIATE,
            },
        }
    },
    {
        timestamps: true,
    }
)

module.exports = Payment
