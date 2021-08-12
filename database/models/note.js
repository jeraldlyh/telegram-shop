const { DataTypes, Deferrable } = require("sequelize")
const db = require("../index")
const Payment = require("./payment")


const Note = db.define(
    "Note",
    {
        paymentID: {
            type: DataTypes.UUID,
            references: {
                model: Payment,
                key: "id",
                deferrable: Deferrable.INITIALLY_IMMEDIATE,
            },
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        timestamps: true,
    }
)

module.exports = Note
