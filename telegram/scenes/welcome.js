const { Scenes, Markup } = require("telegraf")


const welcomeScene = new Scenes.BaseScene("WELCOME_SCENE")

welcomeScene.enter(async (ctx) => {
    const BOT_NAME = ctx.botInfo.first_name
    const message = `Welcome to ${BOT_NAME}

\\<insert shop description here\\>

_Press a key on the bottom keyboard to select an option\\.
If the keyboard has not opened, you can open it by pressing the button with four small squares in the message bar\\._
`

    await ctx.replyWithMarkdownV2(message, Markup
        .keyboard([
            ["View Categories", "View Cart"]
        ])
        .oneTime()
        .resize()
    )

})

welcomeScene.hears("View Categories", ctx => ctx.scene.enter("CATEGORY_SCENE"))
welcomeScene.hears("View Cart", ctx => ctx.scene.enter("CART_SCENE"))

welcomeScene.leave(ctx => {
    console.log("leaving")
})

module.exports = {
    welcomeScene
}