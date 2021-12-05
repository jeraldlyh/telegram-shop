const { Scenes } = require("telegraf")
const Cart = require("../modules/cart")
const Utils = require("../utils")
const Template = require("../template")


const noteScene = new Scenes.BaseScene("NOTE_SCENE")

/**
 * Upon entering, scene contains:
 * 1. Voucher applied, if any (i.e. ctx.scene.state.voucher)
 * 2. Delivery date, if any (i.e. ctx.scene.state.date)
 * 
 * isWaiting: {
 *      status: true,               // If user is in text-only mode
 * }
 */

noteScene.enter(async (ctx) => {
    Utils.initializeScene(ctx)
    await Utils.sendWelcomeMessage(ctx, Template.noteWelcomeMessage(), Template.noteMenuButtons())
    Utils.sendSystemMessage(ctx, Template.inputNoteMessage(), Template.inputNoteButton())
})

// Listener to clear message after scene ends
noteScene.on("message", async (ctx) => {
    Utils.updateUserMessageInState(ctx, ctx.message)        // Append normal messages into session clean up state
    Utils.checkForHomeButton(ctx, ctx.message)

    if (!Utils.isInputMode(ctx)) {
        Utils.sendSystemMessage(ctx, Template.noteConfirmationMessage(ctx.message.text), Template.confirmationButtons())
        ctx.session.isWaiting.note = ctx.message.text
        ctx.session.isWaiting.status = true     // Activate text input mode
    }
})

noteScene.on("callback_query", async (ctx) => {
    if (Utils.isInputMode(ctx)) {
        if (ctx.callbackQuery.data === "Yes") {
            Cart.editOverallCartByID(
                ctx,
                ctx.scene.state.cartMessage.id,
                ctx.scene.state.voucher,
                ctx.scene.state.deliveryDate,
                ctx.session.isWaiting.note
            )
            ctx.scene.enter("PAYMENT_SCENE", {
                voucher: ctx.scene.state.voucher,
                deliveryDate: ctx.scene.state.deliveryDate,
                cartMessage: ctx.scene.state.cartMessage,
                note: ctx.session.isWaiting.note,
            })
        } else {
            Utils.cancelButtonConfirmation(ctx, Template.cancelNoteMessage(), 3)
            Utils.cleanUpMessage(ctx, true, ["user"], true)     // Delete user message
        }
    } else if (ctx.callbackQuery.data === "Skip") {
        ctx.scene.enter("PAYMENT_SCENE", {
            voucher: ctx.scene.state.voucher,
            deliveryDate: ctx.scene.state.deliveryDate,
            cartMessage: ctx.scene.state.cartMessage,
        })
    }
    await ctx.answerCbQuery()
})

noteScene.leave(async (ctx) => {
    try {
        console.log("Cleaning note scene")
        Utils.clearTimeout(ctx)
        Utils.cleanUpMessage(ctx, true)
    } catch (error) {
        
    }
})

module.exports = {
    noteScene
}