const { Telegraf, Markup } = require("telegraf")
const db = require("../db")
const Category = require("./commands/category")
const Dummy = require("./commands/dummy")
const Menu = require("./commands/menu")


const bot = new Telegraf(process.env.BOT_TOKEN)

db.authenticate()
    .then(() => console.log("Connection has been established successfully."))
    .catch((err) => console.log(err))
// db.sync({ force: true })



bot.command("start", ctx => Menu.sendWelcomeMessage(ctx))
bot.command("test", ctx => Dummy.createDummyData(ctx))

bot.action("Back to Home", ctx => Menu.sendWelcomeMessage(ctx))
bot.hears("View Categories", ctx => Category.listCategories(ctx))


bot.launch()