const _ = require("lodash")
const { Markup } = require("telegraf")
const Database = require("../database/actions")
const Utils = require("../utils")
const Template = require("../template")



module.exports = {
    getAllCategories: async function (ctx) {
        const shop = await Database.getCategoryByShop(ctx.botInfo.id)
        const data = shop.toJSON()
        const categories = data.Categories

        var bodyMessage = ""
        var inlineKeyboard = []
        var buffer = []

        // Populate category with products
        _.forEach(categories, function (category) {
            bodyMessage += `<b><u>${category.name}</u></b>\n`

            if (buffer.length === 3) {
                inlineKeyboard.push(buffer)
                buffer.length = 0               // Clear array
            }
            buffer.push({ text: category.name, callback_data: `GET /category/${category.name}` })

            // Populate product description
            _.forEach(category.Products, function (product, index) {
                bodyMessage += `${index + 1}. ${product.name} ($${product.price}) ${Utils.determineStockLevel(product.quantity)}\n`
            })
            bodyMessage += "\n"
        })

        if (buffer.length > 0) {            // In case buffer still has items
            inlineKeyboard.push(buffer)
        }

        return await ctx.replyWithHTML(Template.categoryMessage(bodyMessage, ctx.botInfo.first_name), Markup
            .inlineKeyboard(inlineKeyboard)
            .oneTime()
            .resize(),
        )
    },
}
