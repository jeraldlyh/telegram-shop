const _ = require("lodash")
const { Markup } = require("telegraf")
const numeral = require('numeral')


module.exports = {
    welcomeMessage: function (botName) {
        return `Welcome to ${botName}

insert shop description here

<i>Press a key on the bottom keyboard to select an option.</i>
<i>If the keyboard has not opened, you can open it by pressing the button with four small squares in the message bar.</i>
`
    },
    categoryMessage: function (body) {
        return body + `
<i>🟢 - Available</i>
<i>🟡 - Low on stock</i>
<i>🔴 - Out of stock</i>
`
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

        cartMessage += `\nTotal cost: <b>${numeral(totalCost).format("$0,0.00")}</b>`
        return cartMessage
    },
    cartButtons: function () {
        const extra = Markup.inlineKeyboard([
            [{ text: "⬅️ Back to Categories", callback_data: "GET /category" }],
            [{ text: "✅ Proceed to Checkout", callback_data: "GET /checkout" }]
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
                [{
                    text: `Quantity: ${quantity.toString()}`,
                    callback_data: `POST /cart/${categoryName}/${product.name}/quantity/?available=${product.quantity}&?current=${quantity}`
                }]
            ],
        )
        extra.parse_mode = "HTML"
        extra.caption = module.exports.productCardMessage(product)
        return extra
    },
    inputQuantityMessage: function (available, current, productName) {
        return `
Kindly enter a number for your preferred quantity to place an order for <b>${productName}</b>.

Current quantity placed: <b>${numeral(current).format("0,0")}</b>
Available quantity for purchase: <b>${numeral(available).format("0,0")}</b>

<i>You are currently in a text only input mode.</i>
<i>Type 'cancel' to exit this mode.</i>
`
    },
    cancelInputMessage: function () {
        return `
You have successfully exited the text input mode.

You can now continue browsing the catalogue and select the quantity by <b><i>toggling</i></b> the add/remove buttons.
        `
    },
    inputSuccessMessage: function (productName, previous, current) {
        return `
You have successfully updated the quantity for <b>${productName}</b> from <b>${previous}</b> to <b>${current}</b>.

You can now continue browsing the catalogue and select the quantity by <b><i>toggling</i></b> the add/remove buttons.

<i>This message will be deleted after 3 seconds for a better user experience. Please do not be startled. 😊</i>
`
    }
}