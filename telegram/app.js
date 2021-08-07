const { Telegraf, session, Scenes } = require("telegraf")
const CustomScenes = require("./scenes")
const db = require("../database")
const Dummy = require("./commands/dummy")


const bot = new Telegraf(process.env.BOT_TOKEN)

db.authenticate()
    .then(() => console.log("Connection has been established successfully."))
    .catch((err) => console.log(err))
// db.sync({ force: true })

bot.use(session())
const stage = new Scenes.Stage([
    CustomScenes.welcomeScene,
    CustomScenes.categoryScene,
    CustomScenes.productScene,
    CustomScenes.cartScene,
])
bot.use(stage.middleware())

// Commands
bot.command("start", async (ctx) => {
    await ctx.deleteMessage()
    ctx.scene.enter("WELCOME_SCENE")
})

bot.command("test", ctx => Dummy.createDummyData(ctx))

// Listeners
// bot.hears("View Categories", ctx => Category.getAllCategories(ctx))
// bot.hears("Home", ctx => Menu.sendWelcomeMessage(ctx))

bot.launch({ dropPendingUpdates: true })