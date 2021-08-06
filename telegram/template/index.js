const _ = require("lodash")
const { Markup } = require("telegraf")


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
            cartMessage += `${quantity}x ${product.name} - $${productCost}\n`
        })

        const totalCost = _.sumBy(cart, function (product) {
            return product.Orders[0].Cart.quantity * parseFloat(product.price)
        })

        cartMessage += `\nTotal: <b>$${totalCost}</b>`
        return cartMessage
    },
    productCardMessage: function (product, quantity) {
        const extra = Markup.inlineKeyboard([
            { text: "➕ Add", callback_data: `POST /cart/${product.name}/add` },
            { text: quantity.toString(), callback_data: " " },
            { text: "➖ Remove", callback_data: `POST /cart/${product.name}/remove` }
        ])
        extra.caption = `
<b><u>${product.name}</u></b>

<i>${product.description}</i>

Price: <b>$${product.price}</b> | Qty: ${product.quantity}
`
        extra.parse_mode = "HTML"
        return extra
    }
}