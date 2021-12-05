const { DataTypes, Deferrable } = require("sequelize")
const db = require("../index")
const Voucher = require("./voucher")
const User = require("./user")


const VoucherUser = db.define(
    "VoucherUser",
    {
        isClaimed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        voucherID: {
            type: DataTypes.UUID,
            references: {
                model: Voucher,
                key: "id",
                deferrable: Deferrable.INITIALLY_IMMEDIATE,
            },
        },
        userID: {
            type: DataTypes.STRING(30),
            references: {
                model: User,
                key: "telegramID",
            },
        },
    },
    {
        timestamps: true,
    }
)

module.exports = VoucherUser
