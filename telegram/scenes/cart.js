const { Scenes } = require("telegraf")
const Cart = require("../commands/cart")


const cartScene = new Scenes.BaseScene("CART_SCENE")

cartScene.enter(ctx => {
    // Cart.sendCartMessage(ctx)
})


module.exports = {
    cartScene
}