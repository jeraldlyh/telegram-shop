const { Sequelize, DataTypes, Deferrable } = require("sequelize")
const db = require("../db")
const Shop = require("./shop")
const User = require("./user")


const Order = db.define(
	"Order",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
			allowNull: false,
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
	},
	{
		timestamps: true,
	}
)

module.exports = Order
