const { Scenes } = require("telegraf")
const numeral = require("numeral")
const moment = require("moment")
const _ = require("lodash")
const Cart = require("../modules/cart")
const Utils = require("../utils")
const Voucher = require("../modules/voucher")
const Payment = require("../modules/payment")


const paymentScene = new Scenes.BaseScene("PAYMENT_SCENE")

/**
 * Upon entering, scene contains:
 * 1. Voucher applied (i.e. ctx.scene.state.voucher)
 * 2. Delivery date, if any (i.e. ctx.scene.state.deliveryDate)
 * 3. Note, if any (i.e. ctx.scene.state.note)
 */

paymentScene.enter(async (ctx) => {
    Utils.initializeScene(ctx)
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
    Utils.updateInvoiceMessageInState(ctx, invoice)
})

paymentScene.on("successful_payment", async (ctx) => {
    console.log("Success payment", ctx.message.successful_payment)
    Utils.replaceInvoiceToReceiptInState(ctx)
    console.log(ctx.state.cleanUpState)

    const payment = ctx.message.successful_payment
    const invoice = JSON.parse(payment.invoice_payload)
    const hasVoucherApplied = invoice.voucherID

    if (hasVoucherApplied) {
        await Voucher.updateVoucherForUser(invoice.id, invoice.voucherID)
    }
    const addressDetails = {
        lineOne: payment.order_info.shipping_address.street_line1,
        lineTwo: payment.order_info.shipping_address.street_line2,
        city: payment.order_info.shipping_address.city,
        country: payment.order_info.shipping_address.country_code,
        postalCode: payment.order_info.shipping_address.post_code,
        mobile: payment.order_info.phone_number,
    }

    await Payment.createPayment(ctx, addressDetails, ctx.scene.state.deliveryDate, ctx.scene.state.note)
    ctx.scene.enter("WELCOME_SCENE")
})

paymentScene.on("message", async (ctx) => {
    Utils.updateUserMessageInState(ctx, ctx.message.message_id)
})

paymentScene.leave(async (ctx) => {
    console.log("Cleaning payment scene")
    await Utils.clearScene(ctx, true)
})

module.exports = {
    paymentScene
}