const { Sequelize, DataTypes, Deferrable } = require("sequelize")
const db = require("../db")
const Category = require("./category")


const Product = db.define(
	"Product",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING(120),
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		price: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		category: {
			type: DataTypes.UUID,
			references: {
				model: Category,
				key: "id",
				deferrable: Deferrable.INITIALLY_IMMEDIATE,
			},
		},
	},
	{
		timestamps: true,
	}
)

module.exports = Product
