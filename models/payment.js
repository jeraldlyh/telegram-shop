const { Sequelize, DataTypes } = require("sequelize")
const db = require("../db")
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
	},
	{
		timestamps: true,
	}
)

module.exports = Payment
