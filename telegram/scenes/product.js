const { Scenes } = require("telegraf")
const Product = require("../commands/product")
const Cart = require("../commands/cart")
const Utils = require("../utils")
const _ = require("lodash")


const productScene = new Scenes.BaseScene("PRODUCT_SCENE")

productScene.enter(async (ctx) => {
    const cart = await Product.getProductByCategory(ctx, ctx.scene.state.category)
    const message = await Cart.sendMessage(ctx, cart)
    console.log(message.text)
    ctx.session.cartID = message.message_id          // Save cartID to be edited within the session
})

productScene.on("callback_query", async (ctx) => {
    const [method, data] = Utils.getRouteData(ctx)
    const pathData = Utils.getPathData(data)

    switch (method) {
        case "POST":
            const categoryName = pathData[1]
            const productName = pathData[2]
            const action = pathData[3]
            const inlineKeyboardData = _.flatten(ctx.callbackQuery.message.reply_markup.inline_keyboard)
            const currentQuantity = inlineKeyboardData[2].text.split(" ")[1]        // i.e. Quantity: 23

            if (action === "add") {
                await Cart.addProduct(ctx, productName)
                await Product.editMessage(ctx, categoryName, productName, parseInt(currentQuantity) + 1)

                const updatedCart = await Cart.editMessage(ctx, categoryName, ctx.session.cartID)
                ctx.session.cartID = updatedCart.message_id         // Update cart message ID in session data
            } else {
                if (currentQuantity > 0) {
                    await Cart.removeProduct(ctx, productName)
                    await Product.editMessage(ctx, categoryName, productName, parseInt(currentQuantity) - 1)

                    const updatedCart = await Cart.editMessage(ctx, categoryName, ctx.session.cartID)
                    ctx.session.cartID = updatedCart.message_id         // Update cart message ID in session data
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