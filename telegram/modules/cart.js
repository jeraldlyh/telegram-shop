const Utils = require("../utils")
const Database = require("../database/actions")
const Template = require("../template")


module.exports = {
    addProduct: async function (ctx, productName, amount) {
        const product = await Database.getProductByName(ctx.botInfo.id, productName)

        if (product.quantity === 0) {
            throw `<b>${product.name}</b> has just ran out of stocks!`
        }

        const existingOrder = await module.exports.getOrder(ctx.botInfo.id, ctx.from.id)        // Checks if user has a pending order that's incompleted
        const cart = await module.exports.getCart(existingOrder.toJSON().id, product.toJSON().id)

        await cart.increment("quantity", { by: amount })
        await product.decrement("quantity", { by: amount })         // Update available quantity in database
    },
    removeProduct: async function (ctx, productName, amount) {
        const product = await Database.getProductByName(ctx.botInfo.id, productName)
        const existingOrder = await Database.getPendingOrderByUser(ctx.botInfo.id, ctx.from.id)
        const cart = await Database.getCartByProductOrder(existingOrder.toJSON().id, product.toJSON().id)

        await cart.decrement("quantity", { by: amount })
        await product.increment("quantity", { by: amount })     // Update available quantity in database
    },
    editIndivCartByID: async function (ctx, categoryName, messageID) {
        const cart = await Database.getPendingCartByCategory(ctx.botInfo.id, categoryName, ctx.from.id)
        return await ctx.telegram.editMessageText(ctx.chat.id, messageID, undefined, Template.indivCartMessage(cart), Template.cartCheckoutButtons())
    },
    sendOverallCartMessage: async function (ctx, voucher, deliveryDate, note) {
        const cart = await Database.getPendingCartByShopID(ctx.botInfo.id, ctx.from.id)
        const [templateMessage, isEmpty] = Template.overallCartMessage(cart, ctx.botInfo.first_name, voucher, deliveryDate, note)
        const message = await ctx.replyWithHTML(templateMessage)
        return [message, isEmpty]
    },
    editOverallCartByID: async function (ctx, messageID, voucher, deliveryDate, note) {
        const cart = await Database.getPendingCartByShopID(ctx.botInfo.id, ctx.from.id)
        const [templateMessage, isEmpty] = Template.overallCartMessage(cart, ctx.botInfo.first_name, voucher, deliveryDate, note)
        return await ctx.telegram.editMessageText(ctx.chat.id, messageID, undefined, templateMessage, Template.htmlMode())
    },
    getPriceLabelsOfCart: async function (shopID, userID, voucher) {
        const cart = await Database.getPendingCartByShopID(shopID, userID)
        const priceLabels = []
        var totalSavings = 0

        for (const category of cart) {
            for (const product of category.Products) {
                const quantity = product.Orders[0].Cart.quantity
                const productCost = quantity * product.price
                const discount = voucher ? voucher.discount / 100 : 0

                priceLabels.push({
                    label: `${quantity}x ${product.name}`,
                    amount: Utils.convertValueToFloat(100 * productCost),
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
    },
    getCart: async function (orderID, productID) {
        const cart = await Database.getCartByProductOrder(orderID, productID)
        if (!cart) {
            return await Database.createCart(orderID, productID, 0)
        }
        return cart
    },
    getOrder: async function (shopID, userID) {
        const order = await Database.getPendingOrderByUser(shopID, userID)
        if (!order) {
            return await Database.createOrder(userID, shopID)
        }
        return order
    }
}