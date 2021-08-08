const _ = require("lodash")
const Database = require("../../database/actions")
const Template = require("../template")


module.exports = {
    addProduct: async function (ctx, productName, amount) {
        var cart = null
        var existingOrder = null        // Checks if user has a pending order that's incompleted

        const product = await Database.getProductByName(ctx.botInfo.id, productName)

        if (product.quantity === 0) {
            throw `<b>${product.name}</b> has just ran out of stocks!`
        }

        try {
            existingOrder = await Database.getPendingOrderByUser(ctx.botInfo.id, ctx.from.id)
            cart = await Database.getCartByProductOrder(existingOrder.toJSON().id, product.toJSON().id)
        } catch (error) { }

        if (cart) {         // Checks if user has existing cart
            await cart.increment("quantity", { by: amount })
        } else {        // Updates existing order if exist, else create new order
            if (existingOrder) {
                await Database.createCart(existingOrder.toJSON().id, product.toJSON().id, amount)
            } else {
                const newOrder = await Database.createOrder(ctx.from.id, ctx.botInfo.id)
                await Database.createCart(newOrder.toJSON().id, product.toJSON().id, amount)
            }
        }
        await product.decrement("quantity", { by: amount })     // Update available quantity in database
    },
    removeProduct: async function (ctx, productName, amount) {
        const product = await Database.getProductByName(ctx.botInfo.id, productName)
        const existingOrder = await Database.getPendingOrderByUser(ctx.botInfo.id, ctx.from.id)
        const cart = await Database.getCartByProductOrder(existingOrder.toJSON().id, product.toJSON().id)
        await cart.decrement("quantity", { by: amount })
        await product.increment("quantity", { by: amount })     // Update available quantity in database
    },
    sendMessage: async function (ctx, data) {
        return await ctx.replyWithHTML(Template.indivCartMessage(data), Template.cartButtons())
    },
    editMessageByID: async function (ctx, categoryName, messageID) {
        const cart = await Database.getPendingCartByCategory(ctx.botInfo.id, categoryName, ctx.from.id)
        return await ctx.telegram.editMessageText(ctx.chat.id, messageID, undefined, Template.indivCartMessage(cart), Template.cartButtons())
    },
    sendOverallCartMessage: async function (ctx) {
        const cart = await Database.getPendingCartByShopID(ctx.botInfo.id, ctx.from.id)
        return await ctx.replyWithHTML(Template.overallCartMessage(cart, ctx.botInfo.first_name), Template.paymentButtons())
    }
}