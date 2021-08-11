const { Scenes } = require("telegraf")
const Cart = require("../modules/cart")
const Utils = require("../utils")
const Template = require("../template")
const Calendar = require("../modules/calendar")


const dateScene = new Scenes.BaseScene("DATE_SCENE")

/**
 * Upon entering, scene contains:
 * 1. Voucher applied from cart scene (i.e. ctx.scene.state.voucher)
 * 
 * isWaiting: {
 *      status: true,               // If user is in text-only mode
 *      date: XXX                   // callback_query that user selects
 * }
 */

dateScene.enter(async (ctx) => {
    Utils.initializeScene(ctx)
    Utils.sendWelcomeMessage(ctx, Template.dateWelcomeMessage(), Template.dateMenuButtons())
    const calendar = await Calendar.sendCalendarMessage(ctx)
    Utils.updateCleanUpState(ctx, { id: calendar.message_id, type: "calendar" })     // Update as calendar type to prevent message from deletion in midst of selecting a date

    const [cart, isEmpty] = await Cart.sendOverallCartMessage(ctx, ctx.scene.state.voucher, null, null)
    Utils.updateCleanUpState(ctx, { id: cart.message_id, type: "cart" })
})

dateScene.on("callback_query", async (ctx) => {
    const data = ctx.callbackQuery.data

    if (data !== "NIL") {
        if (!Utils.isTextMode(ctx)) {
            const message = await Calendar.sendConfirmationMessage(ctx, data)
            Utils.updateSystemMessageInState(ctx, message)
            ctx.session.isWaiting = {       // Activate input mode
                status: true,
                data: data
            }
        } else {
            if (data === "Yes") {
                await Cart.editOverallCartByID(ctx, Utils.getCartMessageByID(ctx), ctx.scene.state.voucher, ctx.session.isWaiting.data)
                // ctx.scene.enter("NOTE_SCENE")
            } else if (data === "No") {
                // Utils.disableWaitingStatus(ctx)
                // await Utils.sendSystemMessage(ctx, Template.cancelDateMessage())
                await Utils.cancelDateInput(ctx, Template.cancelDateMessage(), 5)
            }
        }
    }
    await ctx.answerCbQuery()
})

// Listener to clear message after scene ends
dateScene.on("message", async (ctx) => {
    Utils.updateUserMessageInState(ctx, ctx.message)        // Append normal messages into session clean up state
    Utils.checkForHomeButton(ctx, ctx.message)
})

dateScene.leave(async (ctx) => {
    console.log("Cleaning date scene")
    Utils.clearScene(ctx, true)
})

module.exports = {
    dateScene
}