import { DataTypes, Deferrable, Model } from "sequelize"
import { CartAttributes } from "database/interfaces"
import sequelize from "../index"
import Order from "./order"
import Product from "./product"


interface CartCreationAttributes extends CartAttributes { }
interface CartInstance extends Model<CartAttributes, CartCreationAttributes>, CartAttributes {
    createdAt?: Date,
    updatedAt?: Date,
}

const Cart = sequelize.define<CartInstance>(
    "Cart",
    {
        orderID: {
            type: DataTypes.UUID,
            references: {
                model: Order,
                key: "id",
                deferrable: Deferrable.INITIALLY_IMMEDIATE,
            },
        },
        productID: {
            type: DataTypes.UUID,
            references: {
                model: Product,
                key: "id",
                deferrable: Deferrable.INITIALLY_IMMEDIATE,
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        timestamps: true,
    }
)

export default Cart
