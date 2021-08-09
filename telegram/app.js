const { Telegraf, session, Scenes } = require("telegraf")
const CustomScenes = require("./scenes")
const db = require("../database")
const Dummy = require("./commands/dummy")
const Models = require("../database/models")
const Database = require("../database/actions")
const Utils = require("./utils")
const faker = require("faker")


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
bot.command("start", ctx => {
    validateUserAccount(ctx)          // Validate user accounts upon entering a shop
    ctx.deleteMessage()
    Utils.clearScene(ctx, false)
    ctx.scene.enter("WELCOME_SCENE")
})

bot.command("test", ctx => {
    Dummy.createDummyData(ctx)
    ctx.deleteMessage()
})

bot.command("voucher", async (ctx) => {
    const shop = await Database.getShopByID(ctx.botInfo.id)

    const voucher = await Models.Voucher.create({
        code: faker.lorem.word(),
        discount: Math.floor(Math.random() * (20 - 1 + 1) + 1),     // 1% - 20%
        shopID: shop.toJSON().botID,
        isValid: true,
    })
    ctx.reply(voucher.code)
})

bot.on("message", ctx => {
    console.log(ctx.message.message_id)
    if (ctx.session.cleanUpState && ctx.session.cleanUpState.length > 0) {
        Utils.updateCleanUpState(ctx, ctx.message.message_id)
    } else {
        ctx.session.cleanUpState = [ctx.message.message_id]
    }
})

bot.on("pre_checkout_query", async (ctx) => {
    await ctx.answerPreCheckoutQuery(true)
})

bot.launch({ dropPendingUpdates: true })
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

const validateUserAccount = async (ctx) => {
    const user = await Database.getUserByID(ctx.from.id)
    if (!user) {
        await Database.createUser({
            telegramID: ctx.from.id,
            name: ctx.from.first_name
        })
    }
}