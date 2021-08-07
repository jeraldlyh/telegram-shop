const { DataTypes, Deferrable } = require("sequelize")
const db = require("../index")
const Order = require("./order")
const Product = require("./product")


const Cart = db.define(
    "Cart",
    {
        orderID: {
            type: DataTypes.UUID,
            references: {
                model: Order,
                key: "id",
                deferrable: Deferrable.INITIALLY_IMMEDIATE,
            },
        },
        productID: {
            type: DataTypes.UUID,
            references: {
                model: Product,
                key: "id",
                deferrable: Deferrable.INITIALLY_IMMEDIATE,
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        timestamps: true,
    }
)

module.exports = Cart
