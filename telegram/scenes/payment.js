const { Scenes } = require("telegraf")
const numeral = require("numeral")
const moment = require("moment")
const _ = require("lodash")
const Cart = require("../commands/cart")
const Utils = require("../utils")
const Voucher = require("../commands/voucher")
const Payment = require("../commands/payment")


const paymentScene = new Scenes.BaseScene("PAYMENT_SCENE")

paymentScene.enter(async (ctx) => {
    ctx.session.cleanUpState = []

    const priceLabels = await Cart.getPriceLabelsOfCart(ctx.botInfo.id, ctx.from.id, ctx.scene.state.voucher)
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
        need_phone_number: true,
    })
    // Utils.updateSystemMessageInState(ctx, invoice)
})

paymentScene.on("successful_payment", async (ctx) => {
    console.log("Success payment", ctx.message.successful_payment)
    const payment = ctx.message.successful_payment
    const invoice = JSON.parse(payment.invoice_payload)
    const hasVoucherApplied = invoice.voucherID

    if (hasVoucherApplied) {
        await Voucher.updateVoucherForUser(invoice.id, invoice.voucherID)
    }
    const orderDetails = {
        lineOne: payment.order_info.shipping_address.street_line1,
        lineTwo: payment.order_info.shipping_address.street_line2,
        city: payment.order_info.shipping_address.city,
        country: payment.order_info.shipping_address.country_code,
        postalCode: payment.order_info.shipping_address.post_code,
        mobile: payment.order_info.phone_number,
    }

    await Payment.createPayment(ctx, orderDetails)
    ctx.scene.enter("WELCOME_SCENE")
})

paymentScene.leave(async (ctx) => {
    console.log("Cleaning payment scene")
    await Utils.clearScene(ctx, true)
})

module.exports = {
    paymentScene
}