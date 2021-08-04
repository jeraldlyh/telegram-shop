const { Telegraf, Composer } = require("telegraf")
const _ = require("lodash")
const db = require("../db")
const Category = require("./commands/category")
const Dummy = require("./commands/dummy")
const Menu = require("./commands/menu")

const Routes = require("./routes")


const bot = new Telegraf(process.env.BOT_TOKEN)

db.authenticate()
    .then(() => console.log("Connection has been established successfully."))
    .catch((err) => console.log(err))
// db.sync({ force: true })

// Commands
bot.command("start", ctx => Menu.sendWelcomeMessage(ctx))
bot.command("test", ctx => Dummy.createDummyData(ctx))

// Routing Queries
bot.use(Routes)

// Listeners
bot.hears("View Categories", ctx => Category.getAllCategories(ctx))

bot.launch({ dropPendingUpdates: true })