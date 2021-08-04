const _ = require("lodash")
const Template = require("../template")
const Database = require("../../db/actions")
const Cart = require("./cart")


module.exports = {
    getProductByCategory: async function (ctx, categoryName) {
        const products = await Database.getProductByCategory(ctx.botInfo.id, categoryName)
        for (const product of products) {
            await module.exports.sendProductCardMessage(ctx, product)
        }
        await Cart.sendCartMessage(ctx, categoryName)
    },
    getProductByName: async function (ctx, productName) {
        const product = await Database.getProductByName(productName)
        module.exports.sendProductCardMessage(ctx, product)
    },
    sendProductCardMessage: async function (ctx, product) {
        await ctx.replyWithPhoto(product.image, Template.productCardMessage(product))
    }
}