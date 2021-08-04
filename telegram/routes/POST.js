const Utils = require("../utils")
const Category = require("../commands/category")
const Product = require("../commands/product")
const Cart = require("../commands/cart")


module.exports = async function (ctx, route) {
    const data = Utils.getCallbackPaths(route)
    const path = data[0]

    switch (path) {
        case "category":
            break

        case "product":
            break

        case "cart":
            const productName = data[1]
            const action = data[2]

            Cart.addProductToCart(ctx, productName, action)
            break

        default:
            break
    }
}