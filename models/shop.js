const { DataTypes, Deferrable } = require("sequelize")
const db = require("../db/index")
const Owner = require("./owner")


const Shop = db.define(
	"Shop",
	{
		botID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING(120),
			allowNull: false,
		},
		ownerID: {
			type: DataTypes.INTEGER,
			references: {
				model: Owner,
				key: "telegramID",
				deferrable: Deferrable.INITIALLY_IMMEDIATE,
			},
		},
	},
	{
		timestamps: true,
	}
)

module.exports = Shop
