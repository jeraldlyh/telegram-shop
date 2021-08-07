const { Scenes } = require("telegraf")
const Cart = require("../commands/cart")
const Utils = require("../utils")

const cartScene = new Scenes.BaseScene("CART_SCENE")

cartScene.enter(async (ctx) => {
    await Cart.sendOverallCartMessage(ctx)
})

// Listener to clear message after scene ends
cartScene.on("message", async (ctx) => {
    Utils.updateCleanUpState(ctx, ctx.message.message_id)
})

cartScene.leave(async (ctx) => {
    console.log("Cleaning welcome scene")
    await Utils.cleanUpMessage(ctx)
})

module.exports = {
    cartScene
}