import { DataTypes, Deferrable, Model, Optional } from "sequelize"
import sequelize from "../index"
import Category from "./category"


interface ProductAttributes {
    id: string,
    name: string,
    description: string,
    image: string,
    price: number,
    quantity: number,
    categoryID: string,
}

interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> { }
interface ProductInstance extends Model<ProductAttributes, ProductCreationAttributes>, ProductAttributes {
    createdAt?: Date,
    updatedAt?: Date,
}

const Product = sequelize.define<ProductInstance>(
    "Product",
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
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(200),
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
        categoryID: {
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

export default Product
