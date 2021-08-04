const _ = require("lodash")
const { Op } = require("sequelize")
const { Markup } = require("telegraf")
const { Shop, Category, Product } = require("../../models")


module.exports = {
    getProductByCategory: async function (ctx, categoryName) {
        const data = await Category.findOne({
            where: {
                name: categoryName,
                shopID: ctx.botInfo.id
            },
            include: [{
                model: Product,
                // where: {
                //     quantity: { [Op.ne]: 0 }        // Return products that have available quantity
                // }
            }]
        })

        const products = data.Products
        _.forEach(products, function (product) {
            module.exports.sendProductCardMessage(ctx, product)
        })
    },
    getProductByName: async function (ctx, productName) {
        const data = await Category.findOne({
            where: { shopID: ctx.botInfo.id },
            include: [{
                model: Product,
                where: { name: productName }
            }]
        })

        module.exports.sendProductCardMessage(ctx, data.toJSON().Products[0])
    },
    sendProductCardMessage: async function (ctx, product) {
        const extra = Markup.inlineKeyboard([
            { text: "➕ Add", callback_data: `/product/${product.name}/add?user=${ctx.from.id}` },
            { text: "➖ Remove", callback_data: `/product/${product.name}/remove?user=${ctx.from.id}` }
        ])
        extra.caption = `
<b><u>${product.name}</u></b>

<i>${product.description}</i>

Price: <b>$${product.price}</b> | Qty: ${product.quantity}
`
        extra.parse_mode = "HTML"
        ctx.replyWithPhoto(product.image, extra)
    }
}