import { DataTypes, Deferrable, Model } from "sequelize"
import sequelize from "../index"
import User from "./user"


interface ShopAttributes {
    botID: string,
    name: string,
    image: string,
    botToken: string,
    ownerID: string
}

interface ShopCreationAttributes extends ShopAttributes { }
interface ShopInstance extends Model<ShopAttributes, ShopCreationAttributes>, ShopAttributes {
    createdAt?: Date,
    updatedAt?: Date,
}

const Shop = sequelize.define<ShopInstance>(
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
            allowNull: true,
        },
        botToken: {
            type: DataTypes.STRING(60),
            allowNull: false
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

export default Shop
