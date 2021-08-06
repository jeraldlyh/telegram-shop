const { Scenes } = require("telegraf")
const Product = require("../commands/product")
const Cart = require("../commands/cart")
const Utils = require("../utils")
const _ = require("lodash")


const productScene = new Scenes.BaseScene("PRODUCT_SCENE")

productScene.enter(async (ctx) => {
    const messageID = await Product.getProductByCategory(ctx, ctx.scene.state.category)
})

productScene.on("callback_query", async (ctx) => {
    const [method, data] = Utils.getRouteData(ctx)
    const pathData = Utils.getPathData(data)

    switch (method) {
        case "POST":
            const productName = pathData[1]
            const action = pathData[2]
            const inlineKeyboardData = _.flatten(ctx.callbackQuery.message.reply_markup.inline_keyboard)
            const currentQuantity = inlineKeyboardData[1].text
            const messageID = ctx.callbackQuery.message.message_id

            if (action === "add") {

                await Cart.addProductToCart(ctx, productName)
                await Product.editProductMessage(ctx, messageID, productName, parseInt(currentQuantity) + 1)
            } else {
                if (currentQuantity > 0) {
                    await Cart.removeProductFromCart(ctx, productName)
                    await Product.editProductMessage(ctx, messageID, productName, parseInt(currentQuantity) - 1)
                }
            }
            break

        default:
            break
    }
    await ctx.answerCbQuery().catch(err => console.log(err))
})

module.exports = {
    productScene
}