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
    categoryMessage: function (body, botName) {
        return body + `
<i>🟢 - Available</i>
<i>🟡 - Low on stock</i>
<i>🔴 - Out of stock</i>

<i>Below is the list of categories that ${botName} offers.</i>
`
    },
    indivCartMessage: function (cart) {
        var message = "🛒 Your cart contains the following products:\n\n"
        var totalCost = 0

        if (cart && cart.length !== 0) {
            _.forEach(cart, function (product) {
                const quantity = product.Orders[0].Cart.quantity
                const productCost = quantity * parseFloat(product.price)
                message += `${quantity}x ${product.name} - ${numeral(productCost).format("$0,0.00")}\n`
                totalCost += productCost
            })
        } else {
            message += "<i>You have yet to place any orders for this category.</i>\n"
        }

        message += `\nTotal cost: <b>${numeral(totalCost).format("$0,0.00")}</b>`
        return message
    },
    overallCartMessage: function (cart) {
        var message = "🛒 Your cart contains the following products:\n\n"
        var totalCost = 0

        for (const category of cart) {
            if (category.Products && category.Products.length !== 0) {
                message += `<b><u>${category.name}</u></b>\n`
                for (const product of category.Products) {
                    const quantity = product.Orders[0].Cart.quantity
                    const productCost = quantity * product.price
                    message += `${quantity}x ${product.name} - ${numeral(productCost).format("$0,0.00")}\n`
                    totalCost += productCost
                }
                message += "\n"
            }
        }
        message += `Total cost: <b>${numeral(totalCost).format("$0,0.00")}</b>`
        return message
    },
    paymentButtons: function () {
        const extra = Markup
            .keyboard([
                ["⭐ Apply Voucher Code"],
                ["💳 Proceed to Payment"],
            ])
            .resize()

        return extra
    },
    cartButtons: function () {
        const extra = Markup.inlineKeyboard([
            [{ text: "⬅️ Back to Categories", callback_data: "GET /category" }],
            [{ text: "✅ Proceed to Checkout", callback_data: "GET /checkout" }]
        ])
        return extra
    },
    productCardMessage: function (product) {
        const caption = `
<b><u>${product.name}</u></b>

<i>${product.description}</i>

Price: <b>${numeral(product.price).format("$0,0.00")}</b>
Available Qty: <b>${product.quantity}</b>
`
        return caption
    },
    productButtons: function (categoryName, product, quantity) {
        console.log("Byte length: ", new TextEncoder().encode(`POST /cart/${categoryName}/${product.name}/edit/?avai=${product.quantity}&?current=${quantity}`).length)
        const extra = Markup.inlineKeyboard(
            [
                [
                    { text: "➖ Remove", callback_data: `POST /cart/${categoryName}/${product.name}/remove` },
                    { text: "➕ Add", callback_data: `POST /cart/${categoryName}/${product.name}/add` },
                ],
                [{
                    text: `Quantity: ${quantity.toString()}`,
                    callback_data: `POST /cart/${categoryName}/${product.name}/edit/?avai=${product.quantity}&?current=${quantity}`
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

<i>This message will be deleted after 10 seconds for a better user experience. Please do not be startled. 😊</i>
`
    }
}