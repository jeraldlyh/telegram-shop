const { Scenes, Markup } = require("telegraf")
const Utils = require("../utils")
const Template = require("../template")


const welcomeScene = new Scenes.BaseScene("WELCOME_SCENE")

welcomeScene.enter(async (ctx) => {
    Utils.sendSystemMessage(ctx, Template.welcomeMessage(ctx.botInfo.first_name), Template.welcomeMenuButtons())
})

welcomeScene.hears("📚 View Categories", async (ctx) => {
    await ctx.deleteMessage()
    ctx.scene.enter("CATEGORY_SCENE")
})

welcomeScene.hears("🛒 View Cart", async (ctx) => {
    await ctx.deleteMessage()
    ctx.scene.enter("CART_SCENE")
})

// Listener to clear message after scene ends
welcomeScene.on("message", async (ctx) => {
    Utils.updateUserMessageInState(ctx, ctx.message)
})

welcomeScene.leave(async (ctx) => {
    console.log("Cleaning welcome scene")
    await Utils.clearScene(ctx, true)
})

module.exports = {
    welcomeScene
}