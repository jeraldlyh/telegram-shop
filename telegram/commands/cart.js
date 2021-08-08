const _ = require("lodash")
const Utils = require("../utils")
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
    sendIndivCartMessage: async function (ctx, data) {
        return await ctx.replyWithHTML(Template.indivCartMessage(data), Template.cartButtons())
    },
    editIndivCartByID: async function (ctx, categoryName, messageID) {
        const cart = await Database.getPendingCartByCategory(ctx.botInfo.id, categoryName, ctx.from.id)
        return await ctx.telegram.editMessageText(ctx.chat.id, messageID, undefined, Template.indivCartMessage(cart), Template.cartButtons())
    },
    sendOverallCartMessage: async function (ctx, voucher) {
        const cart = await Database.getPendingCartByShopID(ctx.botInfo.id, ctx.from.id)
        const [templateMessage, isEmpty] = Template.overallCartMessage(cart, ctx.botInfo.first_name, voucher)
        const message = await ctx.replyWithHTML(templateMessage, Template.paymentButtons())
        return [message, isEmpty]
    },
    editOverallCartByID: async function (ctx, messageID) {
        const cart = await Database.getPendingCartByShopID(ctx.botInfo.id, ctx.from.id)
        const [templateMessage, isEmpty] = Template.overallCartMessage(cart, ctx.botInfo.first_name)
        return await ctx.telegram.editMessageText(ctx.chat.id, messageID, undefined, templateMessage, Template.paymentButtons())
    },
    getPriceLabelsOfCart: async function (ctx, voucher) {
        const cart = await Database.getPendingCartByShopID(ctx.botInfo.id, ctx.from.id)
        const priceLabels = []
        var totalSavings = 0

        for (const category of cart) {
            for (const product of category.Products) {
                const quantity = product.Orders[0].Cart.quantity
                const productCost = quantity * product.price
                const discount = voucher ? voucher.discount / 100 : 0

                priceLabels.push({
                    label: `${quantity}x ${product.name}`,
                    amount: 100 * productCost,
                })
                totalSavings += voucher ? (productCost * discount) : 0
            }
        }
        if (totalSavings) {
            priceLabels.push({
                label: "Savings",
                amount: Utils.convertValueToFloat(-100 * totalSavings),
            })
        }
        return priceLabels
    }
}