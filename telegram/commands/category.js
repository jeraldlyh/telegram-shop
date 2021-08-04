const _ = require("lodash")
const { Markup } = require("telegraf")
const { Shop, Category, Product } = require("../../models")
const Utils = require("../utils")


module.exports = {
    getAllCategories: async function (ctx) {
        const shop = await Shop.findOne({
            where: { name: ctx.botInfo.first_name },
            include: [{
                model: Category,
                include: [{
                    model: Product
                }]
            }]
        })

        const data = shop.toJSON()
        const categories = data.Categories
        var output = ""
        var inlineKeyboard = [
            [{ text: "Back to Home", callback_data: "/" }]
        ]
        var buffer = []

        _.forEach(categories, function (category) {
            output += `<b><u>${category.name}</u></b>\n`

            if (buffer.length === 3) {
                inlineKeyboard.push(buffer)
                buffer.length = 0               // Clear array
            }
            buffer.push({ text: category.name, callback_data: `GET /category/${category.name}` })

            // Populate product description
            _.forEach(category.Products, function (product, index) {
                output += `${index + 1}. ${product.name} ($${product.price}) ${Utils.determineStockLevel(product.quantity)}\n`
            })

            output += "\n"
        })

        if (buffer.length > 0) {            // In case buffer still has items
            inlineKeyboard.push(buffer)
        }

        output += "<i>🟢 - Available</i>\n"
        output += "<i>🟡 - Low on stock</i>\n"
        output += "<i>🔴 - Out of stock</i>"

        ctx.replyWithHTML(output, Markup
            .inlineKeyboard(inlineKeyboard)
            .oneTime()
            .resize()
        )
    },
}
