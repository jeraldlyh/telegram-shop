const { Telegraf, Markup } = require("telegraf")
const db = require("../db")
const Category = require("./commands/category")
const Dummy = require("./commands/dummy")


const bot = new Telegraf(process.env.BOT_TOKEN)


db.authenticate()
	.then(() => console.log("Connection has been established successfully."))
	.catch((err) => console.log(err))
// db.sync({ force: true })



bot.command("start", ctx => {
    const BOT_NAME = bot.botInfo.first_name
    const message = `Welcome to ${BOT_NAME}

\\<insert shop description here\\>

_Press a key on the bottom keyboard to select an option\\.
If the keyboard has not opened, you can open it by pressing the button with four small squares in the message bar\\._
`

    ctx.replyWithMarkdownV2(message, Markup
        .keyboard([
            ["View Categories", "View Cart"]
        ])
        .oneTime()
        .resize()
    )
})

bot.command("test", ctx => Dummy.createDummyData(ctx))

bot.hears("View Categories", ctx => Category.listCategories(ctx))


bot.launch()