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
    cartButtons: function () {
        const extra = Markup.inlineKeyboard([
            [{ text: "Back to Categories", callback_data: " abc" }],
            [{ text: "Proceed to Checkout", callback_data: "as" }]
        ])
        extra.parse_mode = "HTML"
        return extra
    },
    productCardMessage: function (product) {
        const caption = `
<b><u>${product.name}</u></b>

<i>${product.description}</i>

Price: <b>$${product.price}</b> | Qty: ${product.quantity}
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