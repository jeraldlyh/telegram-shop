import { DataTypes, Deferrable, Optional, Model } from "sequelize"
import sequelize from "../index"
import Shop from "./shop"


interface CategoryAttributes {
    id: string,
    name: string,
    image: string,
    shopID: string,
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, "id"> { }
interface CategoryInstance extends Model<CategoryAttributes, CategoryCreationAttributes>, CategoryAttributes {
    createdAt?: Date,
    updatedAt?: Date,
}

const Category = sequelize.define<CategoryInstance>(
    "Category",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(100),
            allowNull: false,
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

export default Category
