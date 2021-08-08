const { Scenes } = require("telegraf")
const Cart = require("../commands/cart")
const Utils = require("../utils")

const cartScene = new Scenes.BaseScene("CART_SCENE")

cartScene.enter(async (ctx) => {
    const message = await Cart.sendOverallCartMessage(ctx)
    ctx.session.cleanUpState = [{
        id: message.message_id,
        type: "cart",
    }]
})

// Listener to clear message after scene ends
cartScene.on("message", async (ctx) => {
    Utils.updateCleanUpState(ctx, {
        id: ctx.message.message_id,
        type: "user"
    })
})

cartScene.leave(async (ctx) => {
    console.log("Cleaning welcome scene")
    await Utils.cleanUpMessage(ctx)
})

module.exports = {
    cartScene
}