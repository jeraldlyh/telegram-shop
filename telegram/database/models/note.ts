import { DataTypes, Deferrable, Model, Optional } from "sequelize"
import sequelize from "../index"
import Payment from "./payment"


interface NoteAttributes {
    id: string,
    paymentID: string,
    text: string,
}

interface NoteCreationAttributes extends Optional<NoteAttributes, "id"> { }
interface NoteInstance extends Model<NoteAttributes, NoteCreationAttributes>, NoteAttributes {
    createdAt?: Date,
    updatedAt?: Date,
}

const Note = sequelize.define<NoteInstance>(
    "Note",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        paymentID: {
            type: DataTypes.UUID,
            references: {
                model: Payment,
                key: "id",
                deferrable: Deferrable.INITIALLY_IMMEDIATE,
            },
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        timestamps: true,
    }
)

export default Note
