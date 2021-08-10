const { Scenes } = require("telegraf")
const Cart = require("../modules/cart")
const Utils = require("../utils")
const Voucher = require("../modules/voucher")
const Template = require("../template")


const cartScene = new Scenes.BaseScene("CART_SCENE")

/**
 * cleanUpState: [
 *      { id: 1234, type: "cart" },             // Cart message
 *      { id: 1231, type: "user" }              // User text messages,
 *      { id: 1892, type: "system" }            // System messages
 * ],
 * isWaiting: {
 *      status: true,               // If user is in text-only mode
 * },
 * cart: {                          
 *      isEmpty: true               // Indicates if the cart is empty
 *      message: "ABC"              // Stored as a prop to be sent to payment scene afterwards
 * }
 */

cartScene.enter(async (ctx) => {
    const [message, isEmpty] = await Cart.sendOverallCartMessage(ctx)
    ctx.session.cleanUpState = [{
        id: message.message_id,
        type: "cart",
    }]
    ctx.session.isWaiting = {
        status: false
    }
    ctx.session.cart = {
        isEmpty: isEmpty,
        voucher: null
    }
    ctx.session.timeout = []
})

cartScene.hears("🏠 Back to Home", async (ctx) => {
    Utils.updateUserMessageInState(ctx, ctx.message)
    ctx.scene.enter("WELCOME_SCENE")
})

cartScene.hears("⭐ Apply Voucher Code", async (ctx) => {
    Utils.updateUserMessageInState(ctx, ctx.message)

    if (ctx.session.cart.isEmpty) {
        await Utils.sendSystemMessage(ctx, Template.emptyCartMessage())
    } else {
        ctx.session.isWaiting = {
            status: true
        }
        await Utils.sendSystemMessage(ctx, Template.inputVoucherMessage(ctx.botInfo.first_name))
    }
})

cartScene.hears("💳 Proceed to Payment", async (ctx) => {
    Utils.updateUserMessageInState(ctx, ctx.message)

    if (ctx.session.cart.isEmpty) {
        await Utils.sendSystemMessage(ctx, Template.checkoutErrorMessage())
    } else {
        ctx.scene.enter("PAYMENT_SCENE", { voucher: ctx.session.cart.voucher })
    }
})

// Listener to clear message after scene ends
cartScene.on("message", async (ctx) => {
    Utils.updateUserMessageInState(ctx, ctx.message)        // Append normal messages into session clean up state

    if (Utils.isTextMode(ctx)) {
        if (ctx.message.text === "cancel") {
            return await Utils.cancelInputMode(ctx, Template.cancelVoucherInputMessage(), 5)
        }
        const voucher = await Voucher.getVoucher(ctx, ctx.message.text)

        if (voucher) {
            const claimedAt = await Voucher.validateVoucher(ctx, voucher)
            if (claimedAt) {
                await Utils.sendSystemMessage(ctx, Template.claimedVoucherCode(voucher.code, claimedAt))
            } else {
                ctx.session.cart.voucher = voucher          // Update session data to be passed into payment scene as a prop

                // Send updated cart message with discount code applied
                const [message, isEmpty] = await Cart.sendOverallCartMessage(ctx, voucher)
                Utils.replaceCartMessageInState(ctx, { id: message.message_id, type: "cart" })

                await Utils.cancelInputMode(ctx, Template.voucherSuccessMessage(voucher), 5)
            }
        } else {
            await Utils.sendSystemMessage(ctx, Template.invalidVoucherCode())
        }
    }
})

cartScene.leave(async (ctx) => {
    console.log("Cleaning cart scene")
    Utils.clearTimeout(ctx)
    await Utils.cleanUpMessage(ctx, true)
})

module.exports = {
    cartScene
}