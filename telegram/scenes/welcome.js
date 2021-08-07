const { Scenes, Markup } = require("telegraf")
const Utils = require("../utils")


const welcomeScene = new Scenes.BaseScene("WELCOME_SCENE")

welcomeScene.enter(async (ctx) => {
    const BOT_NAME = ctx.botInfo.first_name
    const text = `Welcome to ${BOT_NAME}

\\<insert shop description here\\>

_Press a key on the bottom keyboard to select an option\\.
If the keyboard has not opened, you can open it by pressing the button with four small squares in the message bar\\._
`

    const message = await ctx.replyWithMarkdownV2(text, Markup
        .keyboard([
            ["View Categories", "View Cart"]
        ])
        .oneTime()
        .resize()
    )
    ctx.session.messageID = [message.message_id]
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
    ctx.session.messageID = _.concat(ctx.session.messageID, ctx.message.message_id)
})

welcomeScene.leave(async (ctx) => {
    console.log("Cleaning welcome scene")
    await Utils.cleanUpMessage(ctx, ctx.session.messageID)
})

module.exports = {
    welcomeScene
}