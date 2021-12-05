const { Sequelize } = require("sequelize")


const sequelize = new Sequelize(
    process.env.DATABASE_URL,
    {
        dialect: "postgres",
        protocol: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
)

sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.")
        sequelize.sync({ force: true })
    })
    .catch(error => console.log("Unable to connect to the database", error))

module.exports = sequelize
