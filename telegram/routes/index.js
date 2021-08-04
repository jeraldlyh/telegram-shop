const { Composer } = require("telegraf")
const GET = require("./GET")
const Menu = require("../commands/menu")


module.exports = Composer.on("callback_query", async (ctx) => {
    const callbackData = ctx.callbackQuery.data.split(" ")
    
    if (callbackData && callbackData.length == 1) {     // Return back to home screen
        Menu.sendWelcomeMessage(ctx)
    } else {
        const method = callbackData[0]
        const data = callbackData[1]
    
        switch (method) {
            case "GET":
                GET(ctx, data)
                break
        
            default:
                break
        }
    }
    await ctx.answerCbQuery().catch(err => console.log(err))
})
