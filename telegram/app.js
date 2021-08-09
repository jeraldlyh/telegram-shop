const { Telegraf, session, Scenes } = require("telegraf")
const CustomScenes = require("./scenes")
const db = require("../database")
const Dummy = require("./commands/dummy")


const bot = new Telegraf(process.env.BOT_TOKEN)

db.authenticate()
    .then(() => console.log("Connection has been established successfully."))
    .catch((err) => console.log(err))
// db.sync({ force: true })

// Middlewares
const stage = new Scenes.Stage([
    CustomScenes.welcomeScene,
    CustomScenes.categoryScene,
    CustomScenes.productScene,
    CustomScenes.cartScene,
    CustomScenes.paymentScene,
], {
    default: CustomScenes.welcomeScene,
})
bot.use(session())
bot.use(stage.middleware())

// Commands
bot.command("start", async (ctx) => {
    await ctx.deleteMessage()
    ctx.scene.enter("WELCOME_SCENE")
})

bot.on("pre_checkout_query", async (ctx) => {
    await ctx.answerPreCheckoutQuery(true)
    await ctx.deleteMessage()
})

bot.command("test", ctx => Dummy.createDummyData(ctx))

bot.launch({ dropPendingUpdates: true })
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))