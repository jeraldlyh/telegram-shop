const { Sequelize } = require("sequelize")


const sequelize = new Sequelize(
    process.env.PG_DATABASE,
    process.env.PG_USER,
    process.env.PG_PASSWORD,
    {
        host: process.env.PG_HOST,
        dialect: "postgres",
        logging: false,
    }
)

async () => {
    try {
        await sequelize.authenticate()
        console.log("Connection has been established successfully.")
    } catch (error) {
        console.log(error)
    }
}

module.exports = sequelize
