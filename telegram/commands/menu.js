const { Markup } = require("telegraf")


module.exports = {
    sendWelcomeMessage: function (ctx) {
        const BOT_NAME = ctx.botInfo.first_name
        const message = `Welcome to ${BOT_NAME}

\\<insert shop description here\\>

_Press a key on the bottom keyboard to select an option\\.
If the keyboard has not opened, you can open it by pressing the button with four small squares in the message bar\\._
`

        ctx.replyWithMarkdownV2(message, Markup
            .keyboard([
                ["View Categories", "View Cart"]
            ])
            .oneTime()
            .resize()
        )
    }
}