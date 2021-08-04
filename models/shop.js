const { DataTypes, Deferrable } = require("sequelize")
const db = require("../db/index")
const User = require("./user")


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
        image: {
            type: DataTypes.STRING(100),
            allowNull: null,
        },
		ownerID: {
			type: DataTypes.INTEGER,
			references: {
				model: User,
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
