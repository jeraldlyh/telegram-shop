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
    ctx.session.isWaiting.date = Calendar.getTodayDate()

    await Utils.sendWelcomeMessage(ctx, Template.dateWelcomeMessage(), Template.dateMenuButtons())
    const calendar = await Calendar.sendCalendarMessage(ctx)
    Utils.updateCleanUpState(ctx, { id: calendar.message_id, type: "calendar" })     // Update as calendar type to prevent message from deletion in midst of selecting a date
})

dateScene.on("callback_query", async (ctx) => {
    const data = ctx.callbackQuery.data

    if (data !== "NIL") {
        if (!Utils.isInputMode(ctx)) {
            if (data === "Previous") {
                const month = parseInt(ctx.session.isWaiting.date.split("-")[1]) - 1
                Calendar.updateDateInState(ctx, month)
                await Calendar.editMessageByID(ctx, Utils.getCalendarMessageID(ctx), month)
            } else if (data === "Next") {
                const month = parseInt(ctx.session.isWaiting.date.split("-")[1]) + 1
                Calendar.updateDateInState(ctx, month)
                await Calendar.editMessageByID(ctx, Utils.getCalendarMessageID(ctx), month)
            } else {
                Utils.sendSystemMessage(ctx, Template.dateConfirmationMessage(data), Template.confirmationButtons())
                ctx.session.isWaiting = {       // Activate input mode
                    status: true,
                    date: data
                }
            }
        } else {
            if (data === "Yes") {
                await Cart.editOverallCartByID(
                    ctx,
                    ctx.scene.state.cartMessage.id,
                    ctx.scene.state.voucher,
                    ctx.session.isWaiting.date,
                    null
                )
                ctx.scene.enter("NOTE_SCENE", {
                    voucher: ctx.scene.state.voucher,
                    deliveryDate: ctx.session.isWaiting.date,
                    cartMessage: ctx.scene.state.cartMessage
                })
            } else if (data === "No") {
                await Utils.cancelButtonConfirmation(ctx, Template.cancelDateMessage(), 3)
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
    try {
        console.log("Cleaning date scene")
        Utils.clearScene(ctx, true)
    } catch (error) {
        
    }
})

module.exports = {
    dateScene
}