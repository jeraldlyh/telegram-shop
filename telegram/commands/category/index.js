module.exports = {
    listCategories: function (ctx) {
        console.log("hear")
        // List category header with products
        ctx.telegram.sendMessage(ctx.message.chat.id, "test")
    }
}
