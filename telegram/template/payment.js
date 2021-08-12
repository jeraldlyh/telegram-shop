const { Markup } = require("telegraf")


module.exports = {
    paymentWelcomeMessage: function () {
        return `
Welcome to the payment page, you're able to make payment for your order now.
`
    },
    paymentMenuButtons: function () {
        const extra = Markup
            .keyboard([
                ["🏠 Back to Home"]
            ])
            .resize()
        extra.parse_mode = "HTML"
        return extra
    }
}