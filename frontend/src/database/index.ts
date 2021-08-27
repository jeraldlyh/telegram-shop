import { Sequelize } from "sequelize"


const sequelize = new Sequelize(
    process.env.PG_DATABASE as string,
    process.env.PG_USER as string,
    process.env.PG_PASSWORD,
    {
        host: process.env.PG_HOST,
        dialect: "postgres",
        //logging: true,
    }
)

// sequelize.sync({ force: true })
export default sequelize