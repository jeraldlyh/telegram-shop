const { Scenes, Composer } = require("telegraf")
const _ = require("lodash")
const Cart = require("../commands/cart")
const Utils = require("../utils")

const paymentScene = new Scenes.BaseScene("PAYMENT_SCENE")

paymentScene.enter(async (ctx) => {
    const priceLabels = await Cart.getPriceLabelsOfCart(ctx, ctx.scene.state.voucher)
    const invoice = await ctx.replyWithInvoice({
        chat_id: ctx.chat.id,
        provider_token: process.env.PROVIDER_TOKEN,
        start_parameter: "get_access",
        title: `Invoice for ${ctx.from.first_name}`,
        description: `You are about to make payment to ${ctx.botInfo.first_name}`,
        currency: "sgd",
        prices: priceLabels,
        payload: {
            id: ctx.from.id
        }
    })
    Utils.updateSystemMessageInState(ctx, invoice)
})

paymentScene.on("successful_payment", ctx => {
    console.log("Success payment")
})

paymentScene.leave(async (ctx) => {
    console.log("Cleaning payment scene")
    await Utils.cleanUpMessage(ctx)
})

module.exports = {
    paymentScene
}