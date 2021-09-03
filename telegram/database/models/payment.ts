import { DataTypes, Deferrable, Model, Optional } from "sequelize"
import { PaymentAttributes } from "database/interfaces"
import sequelize from "../index"
import Order from "./order"
import Address from "./address"


interface PaymentCreationAttributes extends Optional<PaymentAttributes, "id"> { }
interface PaymentInstance extends Model<PaymentAttributes, PaymentCreationAttributes>, PaymentAttributes {
    createdAt?: Date,
    updatedAt?: Date,
}

const Payment = sequelize.define<PaymentInstance>(
    "Payment",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        orderID: {
            type: DataTypes.UUID,
            references: {
                model: Order,
                key: "id",
                deferrable: Deferrable.INITIALLY_IMMEDIATE,
            },
        },
        addressID: {
            type: DataTypes.UUID,
            references: {
                model: Address,
                key: "id",
                deferrable: Deferrable.INITIALLY_IMMEDIATE,
            },
        },
        deliveryDate: {
            type: DataTypes.STRING(15),
            allowNull: false,
        }
    },
    {
        timestamps: true,
    }
)

export default Payment
