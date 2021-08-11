const { Markup } = require("telegraf")
const numeral = require('numeral')


module.exports = {
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
    productWelcomeMessage: function (categoryName, shopName) {
        return `
Below are a list of products from ${categoryName} that <b>${shopName}</b> offers.
`
    },
    productMenuButtons: function () {
        const extra = Markup
            .keyboard([
                ["🏠 Back to Home"]
            ])
            .resize()
        extra.parse_mode = "HTML"
        return extra
    },
    cancelQuantityInputMessage: function () {
        return `
You have successfully exited the text input mode.

You can now continue browsing the catalogue and select the quantity by <b><i>toggling</i></b> the add/remove buttons.

<i>This message will be deleted after 5 seconds for a better user experience. Please do not be startled. 😊</i>
`
    },
    inputSuccessMessage: function (productName, previous, current) {
        return `
You have successfully updated the quantity for <b>${productName}</b> from <b>${previous}</b> to <b>${current}</b>.

You can now continue browsing the catalogue and select the quantity by <b><i>toggling</i></b> the add/remove buttons.

<i>This message will be deleted after 5 seconds for a better user experience. Please do not be startled. 😊</i>
`
    },
}