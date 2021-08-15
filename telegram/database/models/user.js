const { DataTypes } = require("sequelize")
const db = require("../index")


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
        // email: {
        //     type: DataTypes.STRING(320),
        //     unique: true,
        //     allowNull: false,
        // },
        isOwner: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        timestamps: true,
    }
)

module.exports = User
