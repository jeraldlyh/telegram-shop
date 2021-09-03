import { DataTypes, Sequelize, Deferrable, Model, Optional } from "sequelize"
import sequelize from "../index"
import Shop from "./shop"


interface VoucherAttributes {
    id: string,
    code: string,
    discount: number,
    isValid: boolean,
    shopID: string,
}

interface VoucherCreationAttributes extends Optional<VoucherAttributes, "id"> { }
interface VoucherInstance extends Model<VoucherAttributes, VoucherCreationAttributes>, VoucherAttributes {
    createdAt?: Date,
    updatedAt?: Date,
}

const Voucher = sequelize.define<VoucherInstance>(
    "Voucher",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        code: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        discount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isValid: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        shopID: {
            type: DataTypes.INTEGER,
            references: {
                model: Shop,
                key: "botID",
                deferrable: Deferrable.INITIALLY_IMMEDIATE,
            },
        },
    },
    {
        timestamps: true,
    }
)

export default Voucher
