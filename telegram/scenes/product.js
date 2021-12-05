const { Scenes } = require("telegraf")
const Product = require("../modules/product")
const Cart = require("../modules/cart")
const Utils = require("../utils")
const _ = require("lodash")
const Database = require("../database/actions")
const Template = require("../template")


const productScene = new Scenes.BaseScene("PRODUCT_SCENE")

/**
 * Upon entering, this scene contains route params passed from category (i.e. categoryName)
 * 
 * cleanUpState: [
 *      { id: 1234, type: "cart" },             // Cart message
 *      { id: 2445, productName: "Bike" },      // Product messages
 *      { id: 1231, type: "user" }              // User text messages,
 *      { id: 1892, type: "system" }            // System messages
 * ],
 * isWaiting: {
 *      status: true,               // If user is in text-only mode
 *      available: XXX,             // Available stocks for product
 *      current: YYY,               // Current quantity placed for the order
 *      productName: ZZZ,           // Product name
 *      categoryName: AAA,          // Category name
 * }
 */

productScene.enter(async (ctx) => {
    Utils.initializeScene(ctx)
    await Utils.sendWelcomeMessage(ctx, Template.productWelcomeMessage(ctx.scene.state.category, ctx.botInfo.first_name), Template.productMenuButtons())

    const cart = await Database.getPendingCartByCategory(ctx.botInfo.id, ctx.scene.state.category, ctx.from.id)
    const productMessageID = await Product.sendCatalogue(ctx, ctx.scene.state.category, cart)
    ctx.session.cleanUpState = _.concat(ctx.session.cleanUpState, productMessageID)

    await Utils.sendCartMessage(ctx, Template.indivCartMessage(cart), Template.cartCheckoutButtons())
})

productScene.on("callback_query", async (ctx) => {
    if (!Utils.isInputMode(ctx)) {         // Ignore all callbacks if user is in text mode
        const [method, pathData] = Utils.getRouteData(ctx.callbackQuery.data)

        switch (method) {
            case "GET":
                if (pathData[0] === "category") {           // i.e GET /category
                    ctx.scene.enter("CATEGORY_SCENE")
                } else if (pathData[0] === "checkout") {    // i.e GET /checkout
                    ctx.scene.enter("CART_SCENE")
                }
                break
            case "POST":
                const categoryName = pathData[1]                // i.e. ["cart", "Headphones", "Razer Kraken X", "add"]
                const productName = pathData[2]
                const action = pathData[3]
                const inlineKeyboardData = _.flatten(ctx.callbackQuery.message.reply_markup.inline_keyboard)
                const currentQuantity = inlineKeyboardData[2].text.split(" ")[1]        // i.e. Quantity: 23

                try {
                    if (action === "add") {                 // i.e. POST /cart/category/product/add
                        await Cart.addProduct(ctx, productName, 1)
                        await Product.editMessage(ctx, categoryName, productName, parseInt(currentQuantity) + 1)
                        await Cart.editIndivCartByID(ctx, categoryName, Utils.getCartMessageByID(ctx))
                    } else if (action === "remove") {
                        if (currentQuantity > 0) {          // i.e. POST /cart/category/product/remove
                            await Cart.removeProduct(ctx, productName, 1)
                            await Product.editMessage(ctx, categoryName, productName, parseInt(currentQuantity) - 1)
                            await Cart.editIndivCartByID(ctx, categoryName, Utils.getCartMessageByID(ctx))
                        }
                    } else if (action === "edit") {     // i.e. POST /cart/category/product/edit/?available=XXX&?current=YYY
                        const parameters = Utils.getQueryParameters(pathData[4])        // i.e. ["?available", 10, "?current", 8]
                        ctx.session.isWaiting = {
                            status: true,
                            available: parameters[1],
                            current: parameters[3],
                            productName: productName,
                            categoryName: categoryName,
                        }
                        await Utils.sendSystemMessage(ctx, Template.inputQuantityMessage(parameters[1], parameters[3], productName))
                    }
                } catch (error) {
                    await Utils.sendSystemMessage(ctx, error)
                }
                break
            default:
                break
        }
    }
    await ctx.answerCbQuery()
})

// Listener to clear message after scene ends
productScene.on("message", async (ctx) => {
    Utils.updateUserMessageInState(ctx, ctx.message)        // Append normal messages into session clean up state
    Utils.checkForHomeButton(ctx, ctx.message.text)

    if (Utils.isInputMode(ctx)) {       // Checks if user enters text input option
        if (ctx.message.text.toLowerCase() === "cancel") {
            return await Utils.cancelInputMode(ctx, Template.cancelQuantityInputMessage(), 5)
        }

        const available = parseInt(ctx.session.isWaiting.available)
        const current = parseInt(ctx.session.isWaiting.current)
        const productName = ctx.session.isWaiting.productName
        const categoryName = ctx.session.isWaiting.categoryName
        const messageID = Utils.getProductMessageID(ctx, productName)

        try {
            const quantity = parseInt(ctx.message.text)
            if (isNaN(quantity)) {
                throw "Please enter a <b>number</b>!"
            } else if (quantity > available) {
                throw `Kindly enter a number smaller than <b>${available}</b>!`
            }

            await Product.checkValidQuantity(ctx, productName, quantity)

            if (quantity === current) { }
            else if (quantity > current) {
                await Cart.addProduct(ctx, productName, quantity - current)
                await Product.editMessageByID(ctx, categoryName, productName, quantity, messageID)
            } else {
                const difference = current - quantity       // Prevent quantity from becoming negative
                await Cart.removeProduct(ctx, productName, difference < 0 ? 0 : difference)
                await Product.editMessageByID(ctx, categoryName, productName, quantity, messageID)
            }

            await Cart.editIndivCartByID(ctx, categoryName, Utils.getCartMessageByID(ctx))      // Edit cart message with updated quantity
            await Utils.cancelInputMode(ctx, Template.inputSuccessMessage(productName, current, quantity), 5)
        } catch (error) {
            await Utils.sendSystemMessage(ctx, error)
        }
    }
})

productScene.leave(async (ctx) => {
    try {
        console.log("Clearing product scene")
        Utils.clearScene(ctx, true)
    } catch (error) {

    }
})

module.exports = {
    productScene
}