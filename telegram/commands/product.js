const _ = require("lodash")
const Template = require("../template")
const Database = require("../../db/actions")
const Cart = require("./cart")


module.exports = {
    getProductByCategory: async function (ctx, categoryName) {
        const products = await Database.getProductByCategory(ctx.botInfo.id, categoryName)
        const cart = await Database.getCartByCategory(ctx.botInfo.id, categoryName, ctx.from.id)
        const messageID = []

        for (const product of products) {
            const existingOrder = _.find(cart, function (item) {      // Retrieves user existing order on the item
                return item.name === product.name
            })

            const quantity = existingOrder ? existingOrder.Orders[0].Cart.quantity : 0
            const message = await module.exports.sendProductCardMessage(ctx, product, quantity)
            messageID.push(message.message_id)
        }
        await Cart.sendCartMessage(ctx, cart)
        return messageID
    },
    sendProductCardMessage: async function (ctx, product, quantity) {
        return await ctx.replyWithPhoto(product.image, Template.productCardMessage(product, quantity))
    },
    editProductMessage: async function (ctx, messageID, productName, quantity) {
        const product = await Database.getProductByName(ctx.botInfo.id, productName)
        await ctx.editMessageCaption(messageID, Template.productCardMessage(product, quantity))
    }
}