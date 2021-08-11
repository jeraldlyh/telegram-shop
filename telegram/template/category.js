const { Markup } = require("telegraf")


module.exports = {
    categoryWelcomeMessage: function (shopName) {
        return `
Welcome to <b>${shopName}'s</b> catalogue!
`
    },
    categoryMenuButtons: function () {
        const extra = Markup
            .keyboard([
                ["🏠 Back to Home"]
            ])
            .resize()
        extra.parse_mode = "HTML"
        return extra
    },
    categoryMessage: function (body, shopName) {
        return body + `<i>🟢 - Available</i>
<i>🟡 - Low on stock</i>
<i>🔴 - Out of stock</i>

<i>Navigate to the individual category using the buttons below that <b>${shopName}</b> offers.</i>
`
    },
}