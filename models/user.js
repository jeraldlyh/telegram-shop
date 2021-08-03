const { DataTypes, Deferrable } = require("sequelize")
const db = require("../db")


const User = db.define(
	"User",
	{
		telegramID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING(120),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(320),
			unique: true,
			allowNull: false,
		},
		mobile: {
			type: DataTypes.STRING(8),
			unique: true,
			allowNull: false,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = User
