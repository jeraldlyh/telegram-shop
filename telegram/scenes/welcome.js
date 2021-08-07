const { Scenes, Markup } = require("telegraf")
const Utils = require("../utils")
const Template = require("../template")


const welcomeScene = new Scenes.BaseScene("WELCOME_SCENE")

welcomeScene.enter(async (ctx) => {
    const text = Template.welcomeMessage(ctx.botInfo.first_name)

    const message = await ctx.replyWithHTML(text, Markup
        .keyboard([
            ["View Categories", "View Cart"]
        ])
        .oneTime()
        .resize()
    )
    ctx.session.cleanUpState = [message.message_id]
})

welcomeScene.hears("View Categories", async (ctx) => {
    await ctx.deleteMessage()
    ctx.scene.enter("CATEGORY_SCENE")
})

welcomeScene.hears("View Cart", async (ctx) => {
    await ctx.deleteMessage()
    ctx.scene.enter("CART_SCENE")
})

// Listener to clear message after scene ends
welcomeScene.on("message", async (ctx) => {
    Utils.updateCleanUpState(ctx, ctx.message.message_id)
})

welcomeScene.leave(async (ctx) => {
    console.log("Cleaning welcome scene")
    await Utils.cleanUpMessage(ctx)
})

module.exports = {
    welcomeScene
}