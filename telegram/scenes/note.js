const { Scenes } = require("telegraf")
const Cart = require("../modules/cart")
const Utils = require("../utils")
const Voucher = require("../modules/voucher")
const Template = require("../template")


const noteScene = new Scenes.BaseScene("NOTE_SCENE")

/**
 * Upon entering, scene contains:
 * 1. Voucher applied from previous scenes (i.e. ctx.scene.state.voucher)
 * 2. Date selected for delivery (i.e. ctx.scene.state.date)
 * 
 * isWaiting: {
 *      status: true,               // If user is in text-only mode
 *      date: XXX                   // callback_query that user selects
 * }
 */

noteScene.enter(async (ctx) => {
    Utils.initializeScene(ctx)
    Utils.sendWelcomeMessage(ctx, Template.noteWelcomeMessage(), Template.noteMenuButtons())
    
    Utils.sendSystemMessage(ctx, Template.inputNoteMessage(), Template.inputNoteButton())
})

// Listener to clear message after scene ends
noteScene.on("message", async (ctx) => {
    Utils.updateUserMessageInState(ctx, ctx.message)        // Append normal messages into session clean up state
    Utils.checkForHomeButton(ctx, ctx.message)
})


noteScene.leave(async (ctx) => {
    console.log("Cleaning cart scene")
    Utils.clearTimeout(ctx)
    Utils.cleanUpMessage(ctx, true)
})

module.exports = {
    noteScene
}