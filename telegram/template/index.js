const _ = require("lodash")
const { Markup } = require("telegraf")
const numeral = require('numeral')


module.exports = {
    categoryMessage: function (body) {
        var message = body
        message += "<i>🟢 - Available</i>\n"
        message += "<i>🟡 - Low on stock</i>\n"
        message += "<i>🔴 - Out of stock</i>"

        return message
    },
    indivCartMessage: function (cart) {
        var cartMessage = "🛒 Your cart contains the following products:\n\n"

        _.forEach(cart, function (product) {
            const quantity = product.Orders[0].Cart.quantity
            const productCost = quantity * product.price
            cartMessage += `${quantity}x ${product.name} - ${numeral(productCost).format("$0,0.00")}\n`
        })

        const totalCost = _.sumBy(cart, function (product) {
            return product.Orders[0].Cart.quantity * parseFloat(product.price)
        })

        cartMessage += `\nTotal: <b>${numeral(totalCost).format("$0,0.00")}</b>`
        return cartMessage
    },
    cartButtons: function () {
        const extra = Markup.inlineKeyboard([
            [{ text: "Back to Categories", callback_data: "GET /category" }],
            [{ text: "Proceed to Checkout", callback_data: "GET /checkout" }]
        ])
        extra.parse_mode = "HTML"
        return extra
    },
    productCardMessage: function (product) {
        const caption = `
<b><u>${product.name}</u></b>

<i>${product.description}</i>

Price: <b>$${numeral(product.price).format("$0,0.00")}</b> | Qty: ${product.quantity}
`
        return caption
    },
    productButtons: function (categoryName, product, quantity) {
        const extra = Markup.inlineKeyboard(
            [
                [
                    { text: "➖ Remove", callback_data: `POST /cart/${categoryName}/${product.name}/remove` },
                    { text: "➕ Add", callback_data: `POST /cart/${categoryName}/${product.name}/add` },
                ],
                [{ text: `Quantity: ${quantity.toString()}`, callback_data: " " }]
            ],
        )
        extra.parse_mode = "HTML"
        extra.caption = module.exports.productCardMessage(product)
        return extra
    }
}