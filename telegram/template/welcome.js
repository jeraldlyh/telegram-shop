const { Markup } = require("telegraf")


module.exports = {
    welcomeMessage: function (shopName) {
        return `Welcome to <b>${shopName}</b>

insert shop description here

<i>Press a key on the bottom keyboard to select an option.</i>
<i>If the keyboard has not opened, you can open it by pressing the button with four small squares in the message bar.</i>
`
    },
    welcomeMenuButtons: function () {
        return Markup
            .keyboard([
                ["📚 View Categories", "🛒 View Cart"]
            ])
            .resize()
    },
}