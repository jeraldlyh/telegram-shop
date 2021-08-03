const { Sequelize, DataTypes, Deferrable } = require("sequelize")
const db = require("../db")
const Shop = require("./shop")
const User = require("./user")
const OrderItem = require("./orderItem")
const Payment = require("./payment")


const Order = db.define(
	"Order",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
			allowNull: false,
		},
        paymentID: {
            type: DataTypes.UUID,
			references: {
				model: Payment,
				key: "id",
				deferrable: Deferrable.INITIALLY_IMMEDIATE,
			},
        },
        userID: {
			type: DataTypes.INTEGER,
			references: {
				model: User,
				key: "telegramID",
			},
		},
        shopID: {
			type: DataTypes.INTEGER,
			references: {
				model: Shop,
				key: "botID",
			},
		},
        orderItemID: {
            type: DataTypes.UUID,
			references: {
				model: OrderItem,
				key: "id",
				deferrable: Deferrable.INITIALLY_IMMEDIATE,
			},
        },
        status: {
            type: DataTypes.ENUM,
            values: ["PENDING", "COMPLETED"],
            default: "PENDING",
            allowNull: false
        }
	},
	{
		timestamps: true,
	}
)

module.exports = Order
