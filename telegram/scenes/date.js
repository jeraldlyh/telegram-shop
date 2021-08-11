const { Scenes } = require("telegraf")
const Cart = require("../modules/cart")
const Utils = require("../utils")
const Template = require("../template")
const Calendar = require("../modules/calendar")


const dateScene = new Scenes.BaseScene("DATE_SCENE")

/**
 * Upon entering, scene contains:
 * 1. Voucher applied from cart scene (i.e. ctx.scene.state.voucher)
 * 2. Cart message sent in cart scene to edit options into message (i.e. ctx.scene.state.cartMessage)
 * 
 * isWaiting: {
 *      status: true,               // If user is in text-only mode
 *      date: XXX                   // callback_query that user selects
 * }
 */

dateScene.enter(async (ctx) => {
    ctx.session.cleanUpState = [ctx.scene.state.cartMessage]
    ctx.session.isWaiting = {
        status: false
    }
    const message = await Calendar.sendCalendarMessage(ctx)
    Utils.updateCleanUpState(ctx, { id: message.message_id, type: "calendar" })     // Update as calendar type to prevent message from deletion in midst of selecting a date
})

dateScene.on("callback_query", async (ctx) => {
    const data = ctx.callbackQuery.data

    if (!Utils.isTextMode(ctx)) {
        const message = await Calendar.sendConfirmationMessage(ctx, data)
        Utils.updateSystemMessageInState(ctx, message)
        ctx.session.isWaiting = {       // Activate input mode
            status: true,
            data: data
        }
    } else {
        if (data === "Yes") {
            await Cart.editOverallCartByID(ctx, ctx.scene.state.cartMessage.id, ctx.scene.state.voucher, ctx.session.isWaiting.data)
            //move on to next scene
            await Utils.cancelInputMode(ctx, Template.successDateMessage(ctx.session.isWaiting.data), 5)
        } else if (data === "No") {
            Utils.disableWaitingStatus(ctx)
            await Utils.cancelInputMode(ctx, Template.cancelDateMessage(), 5)
        }
    }
    await ctx.answerCbQuery()
})

// Listener to clear message after scene ends
dateScene.on("message", async (ctx) => {
    Utils.updateUserMessageInState(ctx, ctx.message)        // Append normal messages into session clean up state
})

dateScene.leave(async (ctx) => {
    console.log("Cleaning date scene")
    Utils.clearTimeout(ctx)
    Utils.cleanUpMessage(ctx, true)
})

module.exports = {
    dateScene
}