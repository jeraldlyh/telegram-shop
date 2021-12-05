const Template = require("../template")
const Database = require("../database/actions")
const _ = require("lodash")


const PRICE_LIMIT = 13725

module.exports = {
    sendMessage: async function (ctx, categoryName, product, quantity) {
        return await ctx.replyWithPhoto(product.image, Template.productButtons(categoryName, product, quantity))
    },
    editMessage: async function (ctx, categoryName, productName, quantity) {
        const product = await Database.getProductByName(ctx.botInfo.id, productName)
        return await ctx.editMessageCaption(Template.productCardMessage(product), Template.productButtons(categoryName, product, quantity))
    },
    editMessageByID: async function (ctx, categoryName, productName, quantity, messageID) {
        const product = await Database.getProductByName(ctx.botInfo.id, productName)
        return await ctx.telegram.editMessageCaption(ctx.chat.id, messageID, messageID, Template.productCardMessage(product), Template.productButtons(categoryName, product, quantity))
    },
    sendCatalogue: async function (ctx, categoryName, cart) {
        const products = await Database.getProductByCategory(ctx.botInfo.id, ctx.scene.state.category)

        const productMessageID = []
        for (const product of products) {
            const existingOrder = _.find(cart, function (item) {      // Retrieves user existing order on the item
                return item.name === product.name
            })
            const quantity = existingOrder ? existingOrder.Orders[0].Cart.quantity : 0
            const message = await module.exports.sendMessage(ctx, categoryName, product, quantity)
            productMessageID.push({                // Return messageID back to scene for deletion
                id: message.message_id,
                type: "product",
                productName: product.name,
            })
        }

        return productMessageID
    },
    checkValidQuantity: async function (ctx, productName, quantity) {
        const product = Database.getProductByName(ctx.botInfo.id, productName)
        if (quantity * product.price > PRICE_LIMIT) {
            throw `"You've exceed the price limit of ${PRICE_LIMIT}! Kindly enter a smaller quantity 😅`
        }
    }
}