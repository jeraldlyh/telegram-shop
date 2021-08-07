const _ = require("lodash")
const Template = require("../template")
const Database = require("../../database/actions")


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
            const message = await module.exports.sendMessage(ctx, categoryName, product, quantity)
            messageID.push(message.message_id)     // Return messageID back to scene for deletion
        }
        return [cart, messageID]
    },
    sendMessage: async function (ctx, categoryName, product, quantity) {
        return await ctx.replyWithPhoto(product.image, Template.productButtons(categoryName, product, quantity))
    },
    editMessage: async function (ctx, categoryName, productName, quantity) {
        const product = await Database.getProductByName(ctx.botInfo.id, productName)
        return await ctx.editMessageCaption(Template.productCardMessage(product), Template.productButtons(categoryName, product, quantity))
    }
}