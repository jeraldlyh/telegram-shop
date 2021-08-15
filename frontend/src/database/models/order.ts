import { DataTypes, Model, Optional } from "sequelize"
import sequelize from "../index"
import User from "./user"
import Shop from "./shop"


interface OrderAttributes {
    id: string,
    userID: string,
    shopID: string,
    status: string,
}

interface OrderCreationAttributes extends Optional<OrderAttributes, "id"> { }
interface OrderInstance extends Model<OrderAttributes, OrderCreationAttributes>, OrderAttributes {
    createdAt?: Date,
    updatedAt?: Date,
}

const Order = sequelize.define<OrderInstance>(
    "Order",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        userID: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "telegramID",
            },
        },
        shopID: {
            type: DataTypes.INTEGER,
            references: {
                model: Shop,
                key: "botID",
            },
        },
        status: {
            type: DataTypes.ENUM,
            values: ["PENDING", "COMPLETED"],
            defaultValue: "PENDING",
            allowNull: false
        }
    },
    {
        timestamps: true,
    }
)

export default Order
