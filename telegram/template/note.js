const { Markup } = require("telegraf")


module.exports = {
    noteWelcomeMessage: function () {
        return `
Last step before we're able to generate your invoice! 🙂
`
    },
    noteMenuButtons: function () {
        const extra = Markup
            .keyboard([
                ["🏠 Back to Home"]
            ])
            .resize()
        extra.parse_mode = "HTML"
        return extra
    },
    inputNoteMessage: function () {
        return `
Would you like to leave a note along with the order?

<i>Kindly send a message that you wish to place on your order, or press the Skip button below this message to leave nothing</i>
`
    },
    inputNoteButton: function () {
        return Markup.inlineKeyboard([
            { text: "⏩ Skip", callback_data: "Skip" }
        ])
    }
}