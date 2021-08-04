const { Composer } = require("telegraf")
const GET = require("./GET")
const Menu = require("../commands/menu")
const POST = require("./POST")


module.exports = Composer.on("callback_query", async (ctx) => {
    const callbackData = ctx.callbackQuery.data.split(" ")

    // Ignore all outdated callbacks that are past 10 minutes to prevent users from being able to click on button after too long
    const now = new Date().getTime() / 1000 - (10 * 60)
    const isValidCallback = ctx.callbackQuery.message.date > now

    if (isValidCallback) {
        if (callbackData.length == 1) {     // Return back to home screen
            Menu.sendWelcomeMessage(ctx)
        } else {
            const method = callbackData[0]
            const data = callbackData[1]

            switch (method) {
                case "GET":
                    GET(ctx, data)
                    break
                case "POST":
                    POST(ctx, data)
                    break
                default:
                    break
            }
        }
    }
    await ctx.answerCbQuery().catch(err => console.log(err))
})
