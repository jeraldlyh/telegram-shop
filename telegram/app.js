const { Telegraf, session, Scenes, Markup } = require("telegraf")
const faker = require("faker")
const CustomScenes = require("./scenes")
const Dummy = require("./modules/dummy")
const Models = require("../database/models")
const Database = require("../database/actions")
const Utils = require("./utils")
const Template = require("./template")
const Calendar = require("./modules/calendar")


const bot = new Telegraf(process.env.BOT_TOKEN)

// Middlewares
const stage = new Scenes.Stage([
    CustomScenes.welcomeScene,
    CustomScenes.categoryScene,
    CustomScenes.productScene,
    CustomScenes.cartScene,
    CustomScenes.paymentScene,
    CustomScenes.dateScene,
    CustomScenes.noteScene,
], {
    default: CustomScenes.welcomeScene,
})
bot.use(session())
bot.use(stage.middleware())

// TO DELETE
bot.command("test", ctx => {
    Dummy.createDummyData(ctx)
    ctx.deleteMessage()
})

bot.command("a", ctx => {
    ctx.reply("Choose a date", Markup.inlineKeyboard(Calendar.getCalendar()))
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

bot.command("start", async (ctx) => {
    const shop = await Database.getShopByID(ctx.botInfo.id)
    if (!shop) {
        return await Utils.sendSystemMessage(ctx, "The shop has not yet been setup!")
    }
    await validateUserAccount(ctx.from.id, ctx.from.first_name, ctx.botInfo.id, ctx.chat.id)          // Validate user accounts upon entering a shop
    await validateChatRecord(ctx.botInfo.id, ctx.from.id, ctx.chat.id)
    ctx.deleteMessage()
    Utils.clearScene(ctx, true)
    ctx.scene.enter("WELCOME_SCENE")
})

bot.command("setup", async (ctx) => {
    try {
        const shop = await Database.getShopByID(ctx.botInfo.id)
        if (!shop) {
            const token = ctx.message.text.split(" ")[1]
            if (!token) {
                throw "Are you <b>missing</b> a token? Kindly use the command again with the token <i>(i.e. /setup SECRET_BOT_TOKEN)</i>"
            } else if (token !== process.env.BOT_TOKEN) {
                console.log(token, process.env.BOT_TOKEN)
                throw "This is an <b>invalid</b> bot token. Retrieve the token from @BotFather and use the command again <i>(i.e. /setup SECRET_BOT_TOKEN)</i>"
            }

            // Validation of user account
            var user = await validateUserAccount(ctx.from.id, ctx.from.username)
            user.update({
                isOwner: true
            })

            // Creation of shop
            await Database.createShop(ctx.botInfo.id, ctx.botInfo.first_name, ctx.from.id, token)

            // Validation of chat
            validateChatRecord(ctx.botInfo.id, ctx.from.id, ctx.chat.id)
            await Utils.sendSystemMessage(ctx, Template.registrationSuccessMessage(ctx.from.id, ctx.from.username, ctx.botInfo.first_name))
        }
    } catch (error) {
        await Utils.sendSystemMessage(ctx, error)
    }
})

bot.on("message", async (ctx) => {
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

process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))

const validateUserAccount = async (userID, userName) => {
    var user = await Database.getUserByID(userID)
    if (!user) {
        user = await Database.createUser(userID, userName)
    }
    return user
}

const validateChatRecord = async function (shopID, userID, chatID) {
    const chat = await Database.getChat(shopID, userID)
    if (!chat) {
        await Database.createChat(shopID, userID, chatID)
    }
}
