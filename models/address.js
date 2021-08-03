const { Sequelize, DataTypes, Deferrable } = require("sequelize")
const db = require("../db")
const User = require("./user")


const Address = db.define(
	"Address",
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
				deferrable: Deferrable.INITIALLY_IMMEDIATE,
			},
		},	
        address1: {
			type: DataTypes.STRING(120),
			allowNull: false,
		},
        address2: {
			type: DataTypes.STRING(120),
			allowNull: false,
		},
        city: {
			type: DataTypes.STRING(120),
			allowNull: false,
		},
        country: {
			type: DataTypes.STRING(120),
			allowNull: false,
		},
        country: {
			type: DataTypes.STRING(16),
			allowNull: false,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = Address
