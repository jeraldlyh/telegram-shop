const { Scenes } = require("telegraf")
const Category = require("../commands/category")
const Utils = require("../utils")


const categoryScene = new Scenes.BaseScene("CATEGORY_SCENE")

categoryScene.enter(async (ctx) => {
    const message = await Category.getAllCategories(ctx)
    ctx.session.cleanUpState = [message.message_id]
})

categoryScene.action("/", async (ctx) => {
    await ctx.answerCbQuery()
    ctx.scene.enter("WELCOME_SCENE")
})

categoryScene.on("callback_query", async (ctx) => {
    const [method, data] = Utils.getRouteData(ctx)
    const pathData = Utils.getPathData(data)

    switch (method) {
        case "GET":
            if (pathData.length == 1) {
                await ctx.scene.enter("WELCOME_SCENE")
            } else {
                await ctx.scene.enter("PRODUCT_SCENE", { category: pathData[1] })
            }
            break
        default:
            break
    }

    await ctx.answerCbQuery().catch(err => console.log(err))
})

// Listener to clear message after scene ends
categoryScene.on("message", async (ctx) => {
    Utils.updateCleanUpState(ctx, ctx.message.message_id)
})

categoryScene.leave(async (ctx) => {
    console.log("Cleaning category scene")
    await Utils.cleanUpMessage(ctx)
})

module.exports = {
    categoryScene
}