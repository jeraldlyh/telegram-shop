const db = require("./db")
const models = require("./models")
require("dotenv").config()


db.authenticate()
	.then(() => console.log("Connection has been established successfully."))
	.catch((err) => console.log(err))
db.sync({ force: true })
