import { DataTypes, Deferrable, Model } from "sequelize"
import { ChatAttributes } from "database/interfaces"
import sequelize from "../index"
import User from "./user"
import Shop from "./shop"


interface ChatCreationAttributes extends ChatAttributes { }
interface ChatInstance extends Model<ChatAttributes, ChatCreationAttributes>, ChatAttributes {
    createdAt?: Date,
    updatedAt?: Date,
}

const Chat = sequelize.define<ChatInstance>(
    "Chat",
    {
        chatID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        userID: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "telegramID",
                deferrable: Deferrable.INITIALLY_IMMEDIATE,
            },
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

export default Chat
