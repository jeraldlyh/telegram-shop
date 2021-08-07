const _ = require("lodash")
const Template = require("../template")
const Database = require("../../database/actions")


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
    }
}