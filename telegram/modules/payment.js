const Database = require("../database/actions")


module.exports = {
    createPayment: async function (ctx, addressDetails, deliveryDate, deliveryNote) {
        // Get pending order from shop
        var order = await Database.getPendingOrderByUser(ctx.botInfo.id, ctx.from.id)
        order = await order.update({
            status: "COMPLETED"
        })

        // Validate address if exist, else add entry into database
        var address = await Database.getAddress(ctx.from.id, addressDetails)
        if (!address) {
            address = await Database.createAddress(ctx.from.id, addressDetails)
        }

        const payment = await Database.createNewPayment(order.toJSON().id, address.toJSON().id, deliveryDate)

        if (deliveryNote) {
            await Database.createNewNote(payment.toJSON().id, deliveryNote)
        }
    }
}