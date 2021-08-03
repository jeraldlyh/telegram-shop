const _ = require("lodash")
const { Markup } = require("telegraf")
const { Shop, Category, Product } = require("../../../models")
const Utils = require("../../utils")


module.exports = {
    listCategories: async function (ctx) {

        // List category header with products
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
        _.forEach(categories, function (category) {
            output += `<b><u>${category.name}</u></b>\n`

            _.forEach(category.Products, function (product, index) {
                output += `${index + 1}. ${product.name} ($${product.price}) ${Utils.determineStockLevel(product.quantity)}\n`
            })

            output += "\n"
        })

        output += "<i>🟢 - Available</i>\n"
        output += "<i>🟡 - Low on stock</i>\n"
        output += "<i>🔴 - Out of stock</i>"

        ctx.replyWithHTML(output, Markup
            .inlineKeyboard([{ text: "Back to Home", callback_data: "Back to Home" }])
            .oneTime()
            .resize()
        )
    }
}
