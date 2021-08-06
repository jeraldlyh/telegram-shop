const _ = require("lodash")
const Template = require("../template")
const Database = require("../../db/actions")


module.exports = {
    getProductByCategory: async function (ctx, categoryName) {
        const products = await Database.getProductByCategory(ctx.botInfo.id, categoryName)
        const cart = await Database.getCartByCategory(ctx.botInfo.id, categoryName, ctx.from.id)

        for (const product of products) {
            const existingOrder = _.find(cart, function (item) {      // Retrieves user existing order on the item
                return item.name === product.name
            })

            const quantity = existingOrder ? existingOrder.Orders[0].Cart.quantity : 0
            await module.exports.sendMessage(ctx, categoryName, product, quantity)
        }
        return cart
    },
    sendMessage: async function (ctx, categoryName, product, quantity) {
        return await ctx.replyWithPhoto(product.image, Template.productButtons(categoryName, product, quantity))
    },
    editMessage: async function (ctx, categoryName, productName, quantity) {
        const product = await Database.getProductByName(ctx.botInfo.id, productName)
        return await ctx.editMessageCaption(Template.productCardMessage(product), Template.productButtons(categoryName, product, quantity))
    }
}