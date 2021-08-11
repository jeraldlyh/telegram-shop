const { Scenes } = require("telegraf")
const Cart = require("../modules/cart")
const Utils = require("../utils")
const Voucher = require("../modules/voucher")
const Template = require("../template")


const noteScene = new Scenes.BaseScene("NOTE_SCENE")



noteScene.enter(async (ctx) => {
    ctx.session.cleanUpState = [ctx.scene.state.cart]
})



noteScene.leave(async (ctx) => {
    console.log("Cleaning cart scene")
    Utils.clearTimeout(ctx)
    Utils.cleanUpMessage(ctx, true)
})

module.exports = {
    noteScene
}