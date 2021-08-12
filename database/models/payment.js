const { Sequelize, DataTypes, Deferrable } = require("sequelize")
const db = require("../index")
const Order = require("./order")
const Address = require("./address")


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
        },
        addressID: {
            type: DataTypes.UUID,
            references: {
                model: Address,
                key: "id",
                deferrable: Deferrable.INITIALLY_IMMEDIATE,
            },
        },
        deliveryDate: {
            type: DataTypes.STRING(15),
            allowNull: false,
        }
    },
    {
        timestamps: true,
    }
)

module.exports = Payment
