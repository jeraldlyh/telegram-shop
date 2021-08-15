import { DataTypes, Model } from "sequelize"
import sequelize from "../index"


interface UserAttributes {
    telegramID: string,
    name: string,
    isOwner: boolean,
}

interface UserCreationAttributes extends UserAttributes { }
interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {
    createdAt?: Date,
    updatedAt?: Date,
}

const User = sequelize.define<UserInstance>(
    "User",
    {
        telegramID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        isOwner: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        timestamps: true,
    }
)

export default User
