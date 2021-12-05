import { DataTypes, Deferrable, Model, Optional } from "sequelize"
import sequelize from "../index"
import User from "./user"


interface AddressAttributes {
    id: string,
    addressLineOne: string,
    addressLineTwo: string,
    mobile: string,
    city: string,
    country: string,
    postalCode: string,
    userID: string,
}

interface AddressCreationAttributes extends Optional<AddressAttributes, "id"> { }
interface AddressInstance extends Model<AddressAttributes, AddressCreationAttributes>, AddressAttributes {
    createdAt?: Date,
    updatedAt?: Date,
}

const Address = sequelize.define<AddressInstance>(
    "Address",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        addressLineOne: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        addressLineTwo: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        mobile: {
            type: DataTypes.STRING(30),
            unique: true,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        postalCode: {
            type: DataTypes.STRING(16),
            allowNull: false,
        },
        userID: {
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

export default Address
