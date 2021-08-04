const Utils = require("../utils")
const Category = require("../commands/category")
const Product = require("../commands/product")


module.exports = async function (ctx, route) {
    const data = Utils.getCallbackPaths(route)
    const path = data[0]
    const slug = data[1]

    switch (path) {
        case "category":
            if (slug) {
                await Product.getProductByCategory(ctx, slug)
            }
            await Category.getAllCategories(ctx)
            break

        case "product":
            await Product.getProductByName(ctx, slug)
            break

        default:
            break
    }
}