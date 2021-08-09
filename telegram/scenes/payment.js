const { Scenes } = require("telegraf")
const numeral = require("numeral")
const moment = require("moment")
const _ = require("lodash")
const Cart = require("../commands/cart")
const Utils = require("../utils")
const Voucher = require("../commands/voucher")


const paymentScene = new Scenes.BaseScene("PAYMENT_SCENE")

paymentScene.enter(async (ctx) => {
    const priceLabels = await Cart.getPriceLabelsOfCart(ctx, ctx.scene.state.voucher)
    const totalCost = _.sumBy(priceLabels, function (label) {
        return label.amount
    })
    const invoice = await ctx.replyWithInvoice({
        chat_id: ctx.chat.id,
        provider_token: process.env.PROVIDER_TOKEN,
        start_parameter: "get_access",
        title: `Invoice (${moment().format("HH:mm A, DD/MM/YYYY")})`,
        description: `Your total order amounts to ${numeral(totalCost / 100).format("$0,0.00")}.`,
        currency: "SGD",
        prices: priceLabels,
        payload: {
            id: ctx.from.id,
            voucherID: ctx.scene.state.voucher ? ctx.scene.state.voucher.id : null
        },
        need_shipping_address: true,
    })
    Utils.updateSystemMessageInState(ctx, invoice)
})

paymentScene.on("successful_payment", async (ctx) => {
    console.log("Success payment", ctx.message.successful_payment)
    const payment = ctx.message.successful_payment
    const invoice = JSON.parse(payment.invoice_payload)
    const hasVoucherApplied = invoice.voucherID

    if (hasVoucherApplied) {
        await Voucher.updateVoucherForUser(ctx, invoice.voucherID)
    }
})

paymentScene.leave(async (ctx) => {
    console.log("Cleaning payment scene")
    await Utils.clearScene(ctx, true)
})

module.exports = {
    paymentScene
}