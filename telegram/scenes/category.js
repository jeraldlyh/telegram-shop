const { Scenes } = require("telegraf")
const Category = require("../commands/category")
const Utils = require("../utils")


const categoryScene = new Scenes.BaseScene("CATEGORY_SCENE")

categoryScene.enter(async (ctx) => {
    await Category.getAllCategories(ctx)
})

categoryScene.action("/", async (ctx) => {
    await ctx.answerCbQuery()
    return ctx.scene.enter("WELCOME_SCENE")
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

categoryScene.leave(ctx => {
    // Do some cleanup
})

module.exports = {
    categoryScene
}