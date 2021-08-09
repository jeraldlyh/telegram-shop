const { Telegraf, session, Scenes } = require("telegraf")
const CustomScenes = require("./scenes")
const db = require("../database")
const Dummy = require("./commands/dummy")
const Models = require("../database/models")
const Database = require("../database/actions")
const Utils = require("./utils")
const faker = require("faker")
const Template = require("./template")


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
    validateUserAccount(ctx.from.id, ctx.from.first_name)          // Validate user accounts upon entering a shop
    ctx.deleteMessage()
    Utils.clearScene(ctx, true)
    ctx.scene.enter("WELCOME_SCENE")
})

// TO DELETE
bot.command("test", ctx => {
    Dummy.createDummyData(ctx)
    ctx.deleteMessage()
})

// TO DELETE
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

bot.command("setup", async (ctx) => {
    const shop = await Database.getShopByID(ctx.botInfo.id)
    if (!shop) {
        const user = await validateUserAccount(ctx.from.id, ctx.from.first_name)
        user.update({
            isOwner: true
        })
        await Database.createShop(ctx.botInfo.id, ctx.botInfo.first_name, ctx.from.id)
        await Utils.sendSystemMessage(Template.registrationSuccessMessage(ctx.from.id, ctx.from.username, ctx.botInfo.first_name))
    }
})

bot.on("message", ctx => {
    if (ctx.session.cleanUpState && ctx.session.cleanUpState.length > 0) {
        Utils.updateUserMessageInState(ctx, ctx.message)
    } else {
        ctx.session.cleanUpState = [{ id: ctx.message.message_id, type: "user" }]
    }
})

bot.on("pre_checkout_query", async (ctx) => {
    await ctx.answerPreCheckoutQuery(true)
})

bot.launch({ dropPendingUpdates: true })
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

const validateUserAccount = async (userID, userName) => {
    const user = await Database.getUserByID(userID)
    if (!user) {
        return await Database.createUser(userID, userName)
    }
    return user
}