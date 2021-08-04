const _ = require("lodash")
const Database = require("../../db/actions")


module.exports = {
    addProductToCart: async function (ctx, productName, action) {
        var cart = null
        var existingOrder = null        // Checks if user has a pending order that's incompleted

        const product = await Database.getProductByName(ctx.botInfo.id, productName)

        try {
            existingOrder = await Database.getPendingOrderByUser(ctx.botInfo.id, ctx.from.id)
            cart = await Database.getOrderItemByProductOrder(existingOrder.toJSON().id, product.toJSON().id)
        } catch (error) { }


        if (cart) {         // Checks if user has existing cart
            if (action === "add") {
                cart.increment("quantity", { by: 1 })
            } else {
                cart.decrement("quantity", { by: 1 })
            }
        } else {        // Updates existing order if exist, else create new order
            if (existingOrder) {
                await Database.createOrderItem(existingOrder.toJSON().id, product.toJSON().id, 1)
            } else {
                const newOrder = await Database.createOrder(ctx.from.id, ctx.botInfo.id)
                await Database.createOrderItem(newOrder.toJSON().id, product.toJSON().id, 1)
            }
        }
    },
    sendCartMessage: async function (ctx) {
        ctx.replyWithHTML()
    }
}