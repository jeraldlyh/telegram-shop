const welcome = require("./welcome")
const category = require("./category")
const product = require("./product")
const cart = require("./cart")

module.exports = {
    welcomeScene: welcome.welcomeScene,
    categoryScene: category.categoryScene,
    cartScene: cart.cartScene,
    productScene: product.productScene
}