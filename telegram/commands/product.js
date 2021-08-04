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
        Cart.sendCartMessage(ctx)
    },
    getProductByName: async function (ctx, productName) {
        const product = await Database.getProductByName(productName)
        module.exports.sendProductCardMessage(ctx, product)
    },
    sendProductCardMessage: async function (ctx, product) {
        ctx.replyWithPhoto(product.image, Template.productCardMessage(product))
    }
}