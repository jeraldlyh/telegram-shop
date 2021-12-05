const { Scenes } = require("telegraf")
const Category = require("../modules/category")
const Utils = require("../utils")
const Template = require("../template")


const categoryScene = new Scenes.BaseScene("CATEGORY_SCENE")

categoryScene.enter(async (ctx) => {
    Utils.initializeScene(ctx)
    await Utils.sendSystemMessage(ctx, Template.categoryWelcomeMessage(ctx.botInfo.first_name), Template.categoryMenuButtons())
    const message = await Category.getAllCategories(ctx)
    Utils.updateCleanUpState(ctx, { id: message.message_id, type: "system" })
})

categoryScene.on("callback_query", async (ctx) => {
    const [method, pathData] = Utils.getRouteData(ctx.callbackQuery.data)

    switch (method) {
        case "GET":
            ctx.scene.enter("PRODUCT_SCENE", { category: pathData[1] })
            break
        default:
            break
    }
    await ctx.answerCbQuery().catch(err => console.log(err))
})

// Listener to clear message after scene ends
categoryScene.on("message", async (ctx) => {
    Utils.updateUserMessageInState(ctx, ctx.message)        // Append normal messages into session clean up state
    Utils.checkForHomeButton(ctx, ctx.message.text)
})

categoryScene.leave(async (ctx) => {
    try {
        console.log("Cleaning category scene")
        await Utils.clearScene(ctx, true)
    } catch (error) {
        
    }
})

module.exports = {
    categoryScene
}