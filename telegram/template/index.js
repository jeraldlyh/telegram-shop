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
    indivCartMessage: function (products) {
        var productMessage = ""
        // const totalCost =  _.sumBy(products, function(o) { o.price}
        _.forEach(products, function (product) {
            productMessage += `${product.quantity} ${product.name} - $)}`
        })

        var message = `
🛒 Your cart contains the following products:

Total: <b>${amount}</b>
`
    },
    productCardMessage: function (product) {
        const extra = Markup.inlineKeyboard([
            { text: "➕ Add", callback_data: `POST /cart/${product.name}/add` },
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