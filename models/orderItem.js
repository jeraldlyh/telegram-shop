const { Sequelize, DataTypes, Deferrable } = require("sequelize")
const db = require("../db")
const Order = require("./order")
const Product = require("./product")


const OrderItem = db.define(
	"OrderItem",
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

module.exports = OrderItem
